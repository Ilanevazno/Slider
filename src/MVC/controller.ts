import { Model } from './model'; 
import { View } from './view';

export class Controller{
    model = new Model;
    view = new View;
    that = this;
    activePercent: number;

    AccessToDragging(): void {
        this.view.sliderPointer.on("mousedown", (e) => {
            e.preventDefault();
            let shiftX = e.clientX - this.view.sliderPointer[0].getBoundingClientRect().left;
            this.prepareForUsing(e, shiftX);
        });
    }

    prepareForUsing(e: object, shiftX: number): void {
        $(document).on("mousemove", this.StartPointerMove(shiftX).bind(this));
        $(document).on("mouseup", this.StopPointerMove.bind(this));
    }

    StartPointerMove(shiftX: number) {
        return (e: any) => {
            let position: number = e.clientX - shiftX - this.view.sliderBody[0].getBoundingClientRect().left;
            let sliderWidth: number = this.view.sliderBody[0].offsetWidth - this.view.sliderPointer[0].offsetWidth;

            position < 0 ? position = 0 : false;

            position > sliderWidth ? position = sliderWidth : false;
    
            this.view.sliderPointer.css({
                "left": `${position}px`,
            })

            this.view.pointerPercentages = Number(this.model.getValueIndicator(sliderWidth, position));
            this.activePercent = Number(this.model.getValueIndicator(sliderWidth, position));

            try {
                this.view.setValueSetting.val(this.view.pointerPercentages);
                this.view.valueIndicator.text(this.view.pointerPercentages);
            } catch (err) {

            }
        }
    }

    StopPointerMove(): void {
        $(document).off("mousemove");
    }

    initSettings(exemplar: any): void{
        this.view.renderSettingsPanel(exemplar);

        this.view.enablePointerButton.change(function(){
            if(this.view.enablePointerButton.is(':checked')){
                this.view.getValueIndicator();
                this.view.valueIndicator.text(this.activePercent);
            } else {
                this.view.valueIndicator.remove(); 
            }
        }.bind(this));

        this.view.setValueSetting.on("input", function(){
            let successChange = false;

            if (this.view.setValueSetting.val() <= 100 && this.view.setValueSetting.val() >= 0){
                this.view.pointerPercentages = this.view.setValueSetting.val();
                this.view.sliderPointer.css({
                    "left": `${this.view.pointerPercentages}%`
                }) 
                successChange = true;
            } else {
                successChange = false;
            }

            this.view.checkValueSettingCorrect(successChange);
        }.bind(this));
    }
}