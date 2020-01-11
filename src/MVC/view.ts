import { Model } from './model';
import { SettingsPanel } from '../components/panel'
import { GettingPointer }  from '../components/pointer'

export class View{
    pointer: any = new GettingPointer.Pointer;
    settingsPanel: any = new SettingsPanel.Panel;
    viewType: string;
    sliderBody: any;
    valueIndicator: any;
    model: any;

    constructor (model) {
        this.model = model;
    }

    public getSettingsPanel (exemplar) {
        this.settingsPanel.renderSettingsPanel(exemplar);

        return this.settingsPanel;
    }

    public renderPointer (count: any) {
        const pointers = this.pointer.generatePointer(this.sliderBody, this.model.pointerClass, count);
        this.pointer.setOffset(this.viewType);
    }

    public getValueIndicator(data): void {
        for(let i = 0; i < data.length; i++) {
            this.valueIndicator = $('<span/>', {
                class: this.model.valueClass,
                text: data[i].pointerValue
            }).appendTo($(`.${this.model.pointerClass}`)[i]);
        }
    }   

    public removeValueIndicator(): void {
        for(let i = 0; i < $(`.${this.model.pointerClass}`).length; i++) {
            $(`.${this.model.pointerClass}`).eq(i).children().remove();
        }
    }

    public sliderStart(exemplar: any): void{
        if (this.viewType === 'horizontal') {
            this.sliderBody = $('<div/>', {
                class: `${this.model.sliderBodyClass} slider__body-horizontal`
            }).prependTo(exemplar);
    
            this.viewType = 'horizontal'
        } else if (this.viewType === 'vertical') {
            this.sliderBody = $('<div/>', {
                class: `${this.model.sliderBodyClass} slider__body-vertical`
            }).prependTo(exemplar);
        }
    }

    public destroySlider(exemplar: any): void {
        if (exemplar.eq(0).children().eq(0).is(`.${this.model.sliderBodyClass}`)) {
            exemplar.eq(0).children().eq(0).remove();
        }
    }
}