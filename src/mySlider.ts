import * as $ from "jquery";
import './mySlider.scss';
import './fonts/fonts.scss';
import { Model } from './MVC/model';
import { View } from "./MVC/view";
import { Controller } from './MVC/controller';
import { ObserverInterface } from './components/observer';

export namespace Slider {
    const observer = new ObserverInterface.Observer;
    const $ = jQuery;
    let slider: JQuery<HTMLElement>;
    const horizontalType: string = 'horizontal';
    const verticalType: string = 'vertical';
    const singleValue: string = 'singleValue';
    const doubleValue: string = 'doubleValue';
    let arbitraryAmount: number;
    
    jQuery.fn.extend({
        createSlider: function(settings: any = {}){
            let model = new Model(observer);
            let view = new View(model);
            let slider = new Controller(model, view, observer);
            slider.setViewType(settings.viewType || horizontalType);
            slider.setStepSize(settings.stepSize || 1);
            slider.setSliderType(settings.valueType || doubleValue);
            slider.generateSlider(this);
            slider.initSettings(settings.initSettings || false);
            slider.getValueIndicator(settings.valueIndicator ? slider.state : false)
            return 'kek'
        },
    })

    interface jQuery{
        createSlider(): void;
    }
}