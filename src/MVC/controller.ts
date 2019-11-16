import { Model } from './model'; 
import { View } from './view';

export class Controller{
    private model = new Model;
    private view = new View;
    private activePercent: number = 0;
    private sliderWidth: number;
    private pointerPosition: number;
    private stepSize: number;

    public generateSlider(exemplar: JQuery<HTMLElement>){
        this.view.sliderStart(exemplar);
    }

    public AccessToDragging(): void {
        this.view.sliderPointer.on("mousedown", (e) => {
            e.preventDefault();
            let shiftX = e.clientX - this.view.sliderPointer[0].getBoundingClientRect().left;
            this.prepareForUsing(e, shiftX);
        });
    }

    public prepareForUsing(e: object, shiftX: number): void {
        $(document).on("mousemove", this.StartPointerMove(shiftX).bind(this));
        $(document).on("mouseup", this.StopPointerMove.bind(this));
    }

    public StartPointerMove(shiftX: number) {
        return (e: any) => {
            this.sliderWidth = this.view.sliderBody[0].offsetWidth - this.view.sliderPointer[0].offsetWidth;
            let position: number = e.clientX - shiftX - this.view.sliderBody[0].getBoundingClientRect().left;
            this.pointerPosition = position;

            // this.setActivePercentage((this.model.getValueIndicator(this.sliderWidth, this.pointerPosition)));
            this.setStepSettings(this.stepSize);
        }
    }

    public setActivePercentage(percent: any){
        this.activePercent = percent;
        let percentState = this.getActivePercentage();

        this.view.setPointerIndicatorValue(percentState);
    }

    public getActivePercentage(){
        return this.activePercent;
    }

    public setStepSettings(stepSize: number){
        this.setActivePercentage((this.model.getValueIndicator(this.sliderWidth, this.pointerPosition)));
        console.log(this.activePercent);
        if(this.activePercent % stepSize === 0 && this.activePercent <= 100){
            
            this.pointerPosition < 0 ? this.pointerPosition = 0 : false;
            this.pointerPosition > this.sliderWidth ? this.pointerPosition = this.sliderWidth : false;

            this.movePointerTo(this.pointerPosition);

            this.view.setValueSetting.val(this.activePercent);
        }
    }

    public movePointerTo(position: number){
        this.view.sliderPointer.css({
            "left": `${position}px`,
        })

        this.setActivePercentage(this.activePercent);
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
                this.setActivePercentage(this.view.setValueSetting.val());
                let ConvertedFromPercPos = Math.round((this.activePercent * this.sliderWidth) / 100);

                this.movePointerTo(ConvertedFromPercPos);
                
                successChange = true;
            } else {
                successChange = false;
            }

            this.view.setValueSettingCorrect(successChange);
        }.bind(this));
    }
}