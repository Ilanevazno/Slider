const data = require('./constant.json');
// import './mySlider.scss';
import { Model } from './components/MVC/model';
import { View } from "./components/MVC/view";
import { Controller } from './components/MVC/controller';
import { ObserverInterface } from './components/observer';

export namespace Slider {
    const observer = new ObserverInterface.Observer;
    let slider: JQuery<HTMLElement>;
    const horizontalType: string = data.axisX;
    const verticalType: string = data.axisY;
    const singleValue: string = data.singleValue;
    const doubleValue: string = data.doubleValue;
    
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