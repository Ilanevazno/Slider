import { Model } from './model';
import { SettingsPanel } from '../components/panel'

export class View{
    settingsPanel: any = new SettingsPanel.Panel;
    viewType: string;
    sliderBody: any;
    sliderPointer: any;
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
        let renderShiftCounter: number = 0;
        for(let i = 0; i < count; i++) {
            this.sliderPointer = $('<span/>', {
                class: this.model.pointerClass
            }).appendTo(this.sliderBody);
        }

        for (let i = 0; i < $(`.${this.model.pointerClass}`).length; i++) {
            $(`.${this.model.pointerClass}`).eq(i).css({
                "left": `${renderShiftCounter}px`
            })

            renderShiftCounter = renderShiftCounter + 35;
        }
    }

    public getValueIndicator(): void {
        for(let i = 0; i < $(`.${this.model.pointerClass}`).length; i++) {
            this.valueIndicator = $('<span/>', {
                class: this.model.valueClass,
                text: "0"
            }).appendTo($(`.${this.model.pointerClass}`)[i]);
        }
    }   

    public sliderStart(exemplar: any): void{
        if (this.viewType === 'horizontal') {
            this.sliderBody = $('<div/>', {
                class: `${this.model.sliderBodyClass} slider__body-horizontal`
            }).appendTo(exemplar);
    
            this.viewType = 'horizontal'
        } else if (this.viewType === 'vertical') {
            this.sliderBody = $('<div/>', {
                class: `${this.model.sliderBodyClass} slider__body-vertical`
            }).appendTo(exemplar);


            this.viewType = 'vertical'
        }
    }

    public generateInput (inputClass: string, inputText: string) {
        const label = $('<label />', {
            for: inputClass,
            text: inputText
        }).appendTo(this.settingsPanel);
        const input = $('<input />', {
            type: 'text',
            class: `${inputClass}`,
            id: `${inputClass}`
        }).appendTo(label);
    }

    public setPointerIndicatorValue(percent: any){
        try {
            this.valueIndicator.text(percent);
        } catch (err) {
            // console.log("Не могу включить индикатор по причине: ", err);
        }
    }
}