import { Model } from './model';

export class View{

    slider: JQuery<HTMLElement>;
    sliderBody: JQuery<HTMLElement>;
    sliderPointer: JQuery<HTMLElement>;
    model = new Model;
    pointerCoords: any;

    getCoords(elem: JQuery<HTMLElement>){
        console.log("хы");
    }

    sliderStart(){
        this.sliderBody = $('<div/>', {
            class: 'slider__body'
        }).appendTo(this.slider);

        this.sliderPointer = $('<span/>', {
            class: "slider__pointer"
        }).appendTo(this.sliderBody);
        this.pointerCoords = this.getCoords(this.sliderPointer);
    }

    getValueIndicator(){
        let valueIndicator = $('<span/>', {
            class: "slider__value"
        }).appendTo(this.sliderBody);
    }

    preparePointer(): void{
        let startPos = this.pointerCoords + "%";

        this.sliderPointer.css({
            "position": "absolute",
            "left": `${startPos}`,
        })
    }
}