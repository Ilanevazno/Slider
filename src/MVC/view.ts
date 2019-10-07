import { Model } from './model';

export class View{

    constructor () {
        
    }

    slider: JQuery<HTMLElement>;
    sliderBody: JQuery<HTMLElement>;
    sliderPointer: JQuery<HTMLElement>;
    model = new Model;
    pointerCoords: any;

    getCoords(elem: JQuery<HTMLElement>){
    }

    sliderStart(exemplar: any){
        this.sliderBody = $('<div/>', {
            class: 'slider__body'
        }).appendTo(exemplar);

        this.sliderPointer = $('<span/>', {
            class: "slider__pointer"
        }).appendTo(this.sliderBody);
        this.pointerCoords = this.getCoords(this.sliderPointer);
        console.log(exemplar);
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