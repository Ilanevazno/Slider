// import './mySlider.scss';
import { Model } from './components/MVC/model';
import { View } from './components/MVC/view';
import { Controller } from './components/MVC/controller';
import { ObserverInterface } from './components/Observer/Observer';

const data = require('./constant.json');

export namespace Slider {
  const observer = new ObserverInterface.Observer();
  let slider: JQuery<HTMLElement>;
  const horizontalType: string = data.axisX;
  const verticalType: string = data.axisY;
  const { singleValue } = data;
  const { doubleValue } = data;

  jQuery.fn.extend({
    createSlider(settings: any = {}) {
      const model = new Model(observer);
      const view = new View(model);
      const slider = new Controller(model, view, observer);
      slider.setMinValue(settings.minValue || 0);
      slider.setMaxValue(settings.maxValue || 100);
      slider.setViewType(settings.viewType || horizontalType);
      slider.setStepSize(settings.stepSize || 1);
      slider.setSliderType(settings.valueType || doubleValue);
      slider.generateSlider(this);
      slider.initSettings(settings.initSettings || false);
      slider.getValueIndicator(settings.valueIndicator ? slider.model.state : false);
      return slider.model.getState();
    },
  });

  export interface jQuery{
    createSlider();
  }
}
