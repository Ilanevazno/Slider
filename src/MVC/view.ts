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
        let box = elem[0].getBoundingClientRect();
        return {
            left: box.left + pageXOffset
        }
    }

    sliderStart(exemplar: any){
        this.sliderBody = $('<div/>', {
            class: 'slider__body'
        }).appendTo(exemplar);

        this.sliderPointer = $('<span/>', {
            class: "slider__pointer"
        }).appendTo(this.sliderBody);
        this.pointerCoords = this.getCoords(this.sliderPointer);
        this.preparePointer();
    }

    getValueIndicator(){
        let valueIndicator: JQuery<HTMLElement> = $('<span/>', {
            class: "slider__value"
        }).appendTo(this.sliderBody);
    }

    preparePointer(): void{
        // let startPos: number = this.pointerCoords.left;

        this.sliderPointer.css({
            "position": "absolute",
            // "left": `${startPos}%`,
            "z-index": "1000"
        })
    }
}