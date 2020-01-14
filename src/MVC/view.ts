import { Model } from './model';
import { SettingsPanel } from '../components/panel'
import { GettingPointer }  from '../components/pointer'
import { SliderBody } from '../components/sliderBody';
import { PointerIndicator } from '../components/pointerIndicator';

export class View{
    pointer: any = new GettingPointer.Pointer;
    pointerIndicator: any = new PointerIndicator.Indicator;
    sliderBodyExemplar: any = new SliderBody.Body;
    settingsPanel: any = new SettingsPanel.Panel;
    viewType: string;
    valueIndicator: any;
    model: any;
    pointerList: object;
    sliderBodyHtml: any;

    constructor (model) {
        this.model = model;
    }

    public renderSlider(exemplar: any): void{
        this.sliderBodyExemplar.renderSliderBody(this.viewType, this.model.sliderBodyClass, exemplar);
        this.sliderBodyHtml = this.sliderBodyExemplar.getBody();
    }

    public destroySlider (): void {
        this.sliderBodyExemplar.destroy();
    }

    public getSettingsPanel (exemplar) {
        this.settingsPanel.renderSettingsPanel(exemplar);

        return this.settingsPanel;
    }

    public renderPointer (count: any) {
        const pointers = this.pointer.generatePointer(this.sliderBodyExemplar.body, this.model.pointerClass, count);
        this.pointer.setOffset(this.viewType);
        this.pointerList = pointers;
    }

    public getValueIndicator(data): void {
        // for(let i = 0; i < data.length; i++) {
        //     this.valueIndicator = $('<span/>', {
        //         class: this.model.valueClass,
        //         text: data[i].pointerValue
        //     }).appendTo($(`.${this.model.pointerClass}`)[i]);
        // }
        this.pointerIndicator.getIndicator(data, this.model.valueClass);
    }   

    public removeValueIndicator(): void {
        for(let i = 0; i < $(`.${this.model.pointerClass}`).length; i++) {
            $(`.${this.model.pointerClass}`).eq(i).children().remove();
        }
    }
}