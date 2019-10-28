import { Model } from './model'; 
import { View } from './view';

export class Controller{
    model = new Model;
    view = new View;
    that = this;
    activePercent: number = 0;
    sliderWidth: number;
    pointerPosition: number;
    stepSize: number;

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
            this.sliderWidth = this.view.sliderBody[0].offsetWidth - this.view.sliderPointer[0].offsetWidth;
            let position: number = e.clientX - shiftX - this.view.sliderBody[0].getBoundingClientRect().left;
            this.pointerPosition = position;

            this.setStepSettings(this.stepSize);

            this.activePercent = Number(this.model.getValueIndicator(this.sliderWidth, this.pointerPosition));

            console.log((this.activePercent * this.sliderWidth) / 100);
        }
    }

    setStepSettings(stepSize: number){
        if(this.activePercent % stepSize === 0){
            this.view.pointerPercentages = Number(this.model.getValueIndicator(this.sliderWidth, this.pointerPosition));

            // let percent = this.activePercent;

            this.pointerPosition < 0 ? this.pointerPosition = 0 : false;

            this.pointerPosition > this.sliderWidth ? this.pointerPosition = this.sliderWidth : false;

            this.movePointerTo(this.pointerPosition);

            if(this.view.valueIndicator){
                this.view.valueIndicator.text(this.activePercent);
            }

            this.view.setValueSetting.val(this.activePercent);
        }
    }

    movePointerTo(position: number){
        this.view.sliderPointer.css({
            "left": `${position}px`,
        })
    };

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

        this.view.stepSizeSetting.on("input", function(){
            this.stepSize = this.view.stepSizeSetting.val();
        }.bind(this))

        this.view.setValueSetting.on("input", function(){
            let successChange = false;

            if (this.view.setValueSetting.val() <= 100 && this.view.setValueSetting.val() >= 0){
                this.activePercent = this.view.setValueSetting.val();
                let ConvertedFromPercPos = Math.round((this.activePercent * this.sliderWidth) / 100);

                this.movePointerTo(ConvertedFromPercPos);
                this.view.valueIndicator.text(this.view.pointerPercentages);
                successChange = true;
            } else {
                successChange = false;
            }

            this.view.checkValueSettingCorrect(successChange);
        }.bind(this));
    }
}