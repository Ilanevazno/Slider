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
    pointerList: any;
    sliderBodyHtml: any;

    constructor (model) {
        this.model = model;
    }

    public renderSlider(exemplar: any): void{
        this.sliderBodyExemplar.renderSliderBody(this.viewType, this.model.classListNames.sliderBodyClass, exemplar);
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
        const pointers = this.pointer.generatePointer(this.sliderBodyExemplar.body, this.model.classListNames.pointerClass, count);
        this.pointer.setOffset(this.viewType);
        this.pointerList = pointers;
    }

    public getValueIndicator(data): void {
        this.pointerIndicator.getIndicator(data, this.model.classListNames.valueClass);
    }   

    public removeValueIndicator(): void {
        this.pointerIndicator.removeIndicator();
    }
}