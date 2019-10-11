import { Model } from './model';

export class View{
    slider: JQuery<HTMLElement>;
    sliderBody: JQuery<HTMLElement>;
    sliderPointer: JQuery<HTMLElement>;
    valueIndicator: any;
    model: any = new Model;
    pointerPercentages: number;

    sliderStart(exemplar: any): void{
        this.sliderBody = $('<div/>', {
            class: 'slider__body'
        }).appendTo(exemplar);

        this.sliderPointer = $('<span/>', {
            class: "slider__pointer"
        }).appendTo(this.sliderBody);
        this.model.pointerCoords = this.model.getCoords(this.sliderPointer);
    }

    getValueIndicator(): void {
        this.valueIndicator = $('<span/>', {
            class: "slider__value",
            text: "0"
        }).appendTo(this.sliderPointer);
    }   
}