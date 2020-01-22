import { Model } from './model';
import { GettingPointer }  from '../components/pointer'
import { SliderBody } from '../components/sliderBody';
import { PointerIndicator } from '../components/pointerIndicator';

export class View{
    pointer: any = new GettingPointer.Pointer;
    pointerIndicator: any = new PointerIndicator.Indicator;
    sliderBodyExemplar: any = new SliderBody.Body;
    trackLine: any;
    viewType: string;
    valueIndicator: any;
    model: any;
    pointerList: any;
    sliderBodyHtml: any;

    constructor (model) {
        this.model = model;
    }

    public getTrackLine (): void {
        const trackLine = $('<div/>', {
            class: this.model.classList.trackLineClass
        }).appendTo(this.sliderBodyHtml);
        this.trackLine = trackLine;
    }

    public renderSlider(exemplar: any): void{
        this.sliderBodyExemplar.renderSliderBody(this.viewType, this.model.classList.sliderBodyClass, exemplar);
        this.sliderBodyHtml = this.sliderBodyExemplar.getBody();
        this.getTrackLine();
    }

    public destroySlider (): void {
        this.sliderBodyExemplar.destroy();
    }

    public renderPointer (count: any) {
        const pointers = this.pointer.generatePointer(this.sliderBodyExemplar.body, this.model.classList.pointerClass, count);
        this.pointer.setOffset(this.viewType);
        this.pointerList = pointers;
    }

    public getValueIndicator(data): void {
        this.pointerIndicator.getIndicator(data, this.model.classList.valueClass);
    }   

    public removeValueIndicator(): void {
        this.pointerIndicator.removeIndicator();
    }
}