import { Model } from './model'; 
import { View } from './view';

export class Controller{
    model = new Model;
    view = new View;
    that = this;

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
            this.view.valueIndicator[0].innerHTML = this.view.pointerPercentages;
        }
    }

    StopPointerMove(): void {
        $(document).off("mousemove");
    }
}