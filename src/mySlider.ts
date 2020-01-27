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
    
    jQuery.fn.extend({
        createSlider: function(settings: any = {}){
            let model = new Model(observer);
            let view = new View(model);
            let slider = new Controller(model, view, observer);
            slider.setMinValue(settings.minValue || 0);
            slider.setMaxValue(settings.maxValue || 100);
            slider.setViewType(settings.viewType || horizontalType);
            slider.setStepSize(settings.stepSize || 1);
            slider.setSliderType(settings.valueType || doubleValue);
            slider.generateSlider(this);
            slider.initSettings(settings.initSettings || false);
            slider.getValueIndicator(settings.valueIndicator ? slider.model.state : false);
            return slider.model.getState();
        }
    })

    interface jQuery{
        createSlider();
    }
}