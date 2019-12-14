import { Model } from './model'; 
import { View } from './view';

export class Controller{
    private model = new Model;
    private view = new View;
    private activePercent: number = 0;
    private slider: number;
    private pointerPosition: number;
    private stepSize: number;
    private targetedPointer: any;
    firstValue: number;
    secondValue: number;
    sliderType: string;
    firstPointerClass: string = 'first_value';
    secondPointerClass: string = 'second_value';

    public enableLogs (state: boolean) {
        this.model.enableLogs(state);
    }

    public setViewType (viewType: string, valueType: string): void {
        this.view.viewType = viewType;
        this.sliderType = valueType;

        if (this.sliderType === 'singleValue') {
            this.view.renderPointer(1);
            this.view.generateInput('slider__value', 'Значение');
            // this.model.pointerCoords = this.model.getCoords(this.sliderPointer);
        }

        if (this.sliderType === 'doubleValue') {
            this.view.renderPointer(2);
            this.view.generateInput(this.firstPointerClass, 'Значение первого ползунка');
            this.view.generateInput(this.secondPointerClass, 'Значение второго ползунка');
        }
    }

    public generateSlider(exemplar: JQuery<HTMLElement>): void{
        this.model.devLog("Генерирую слайдер");
        this.view.sliderStart(exemplar);
    
    }

    public AccessToDragging(): void {
        for(let i = 0; i < this.view.sliderBody[0].childNodes.length; i++) {
            let element = this.view.sliderBody[0].childNodes[i];
            $(element).on('mousedown', function(e: any) {
                e.preventDefault();

                this.targetedPointer = e.currentTarget;

                if (this.view.viewType === 'horizontal') {
                    let shiftX = e.clientX - $(element)[0].getBoundingClientRect().left;
                    this.prepareForUsing(this.targetedPointer, shiftX);
                } else if (this.view.viewType === 'vertical') {
                    let shiftY = e.clientY - $(element)[0].getBoundingClientRect().top;
                    this.prepareForUsing(this.targetedPointer, shiftY); 
                }
            }.bind(this));
        }
    }

    public prepareForUsing(targetedPointer: any, shift: number): void {
        $(document).on("mousemove", this.StartPointerMove(shift, targetedPointer).bind(this));
        $(document).on("mouseup", this.StopPointerMove.bind(this));
    }

    public StartPointerMove(shift: number, targetedPointer: object) {
        return (e: any) => {
            this.model.devLog("Старт движения ползунка, получаю ширину слайдера и координаты ползунка");

            if (this.sliderType === 'doubleValue') {
                this.firstValue = Number(this.view.sliderBody[0].childNodes[0].style.left.replace('px', ''));
                this.secondValue = Number(this.view.sliderBody[0].childNodes[1].style.left.replace('px', ''));           
            }

            if (this.view.viewType === 'horizontal') {
                this.slider = this.view.sliderBody[0].offsetWidth - this.view.sliderPointer[0].offsetWidth;
                let position: number = e.clientX - shift - this.view.sliderBody[0].getBoundingClientRect().left;
                this.pointerPosition = position;
            } else if (this.view.viewType === 'vertical') {
                this.slider = this.view.sliderBody[0].offsetHeight - this.view.sliderPointer[0].offsetHeight;
                let position: number = e.clientY - shift - this.view.sliderBody[0].getBoundingClientRect().top;
                this.pointerPosition = position;
            }

            this.model.devLog("Устанавливаю шаг");
            this.setStepSettings(this.stepSize);
        }
    }

    public setActivePercentage(percentMin: any, percentMax: any){
        if (this.sliderType === 'singleValue') {
            this.model.devLog(`Устанавливаю процент на ${percentMin}`);
            this.activePercent = percentMin;
    
            this.view.setPointerIndicatorValue(this.activePercent);
        } else if (this.sliderType === 'doubleValue'){
            this.firstValue = percentMin;
            this.secondValue = percentMax;

            $(`input.${this.firstPointerClass}`).val(this.firstValue)
            $(`input.${this.secondPointerClass}`).val(this.secondValue)
        }
    }

    public setStepSettings(stepSize: number){    
        this.model.devLog(`Шаг установлен на ${stepSize}`);
        let cursorPosition = this.model.getValuePercent(this.slider, this.pointerPosition);

        if(cursorPosition % stepSize === 0 && this.activePercent <= 100){
            this.pointerPosition < 0 ? this.pointerPosition = 0 : false;
            this.pointerPosition > this.slider ? this.pointerPosition = this.slider : false;

            this.model.devLog(`Позиция ползунка установлена на ${(this.model.getValuePercent(this.slider, this.pointerPosition))}`);
            this.movePointerTo(this.pointerPosition);
            if (this.sliderType === 'singleValue') {
                this.setActivePercentage((this.model.getValuePercent(this.slider, this.pointerPosition)), 0);
            } else if (this.sliderType === 'doubleValue'){
                this.setActivePercentage((this.model.getValuePercent(this.slider, this.firstValue)), (this.model.getValuePercent(this.slider, this.secondValue)));
            }

            this.view.setValueSetting.val(this.activePercent);
        }
    }

    public movePointerTo(position: number){
        if (this.view.viewType === 'horizontal') {
            $(this.targetedPointer).css({
                "left": `${position}px`,
            })
        } else if (this.view.viewType === 'vertical') {
            this.view.sliderPointer.css({
                "top": `${position}px`,
            })
        }
    };

    public StopPointerMove(): void {
        $(document).off("mousemove");
    }

    public initSettings(exemplar: any): void{
        this.view.renderSettingsPanel(exemplar);

        this.view.enablePointerButton.change(function(){
            if(this.view.enablePointerButton.is(':checked')){
                this.view.getValueIndicator();
                this.view.valueIndicator.text(this.activePercent);
            } else {
                this.view.valueIndicator.remove(); 
            }
        }.bind(this));

        this.view.stepSizeSetting.on("input", function(){
            this.stepSize = this.view.stepSizeSetting.val();
        }.bind(this))

        this.view.setValueSetting.on("input", function(){
            let successChange = true;

            if (this.view.setValueSetting.val() <= 100 && this.view.setValueSetting.val() >= 0){
                this.setActivePercentage(this.view.setValueSetting.val(), 0);
                let ConvertedFromPercPos = Math.round((this.activePercent * this.slider) / 100);

                this.movePointerTo(ConvertedFromPercPos);
                
                successChange = true;
            } else {
                successChange = false;
            }

            this.view.setValueSettingCorrect(successChange);
        }.bind(this));
    }
}