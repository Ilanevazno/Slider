/* eslint-disable @typescript-eslint/no-unused-vars */
import Model from './components/MVC/Model';
import View from './components/MVC/View';
import Controller from './components/MVC/Controller';
import { ObserverInterface } from './components/Observer/Observer';

const data = require('./constant.json');

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Slider {
  const observer = new ObserverInterface.Observer();
  let slider: object;
  const horizontalType: string = data.axisX;
  const verticalType: string = data.axisY;
  const { singleValue } = data;
  const { doubleValue } = data;

  jQuery.fn.extend({
    createSlider(settings: any = {}) {
      const model = new Model(observer);
      const view = new View(model);
      const sliderExemplar = new Controller(model, view, observer);
      sliderExemplar.setMinValue(settings.minValue || 0);
      sliderExemplar.setMaxValue(settings.maxValue || 100);
      sliderExemplar.setViewType(settings.viewType || horizontalType);
      sliderExemplar.setStepSize(settings.stepSize || 1);
      sliderExemplar.setSliderType(settings.valueType || doubleValue);
      sliderExemplar.generateSlider(this);
      sliderExemplar.initSettings(settings.initSettings || false);
      // eslint-disable-next-line max-len
      sliderExemplar.getValueIndicator(settings.valueIndicator ? sliderExemplar.model.state : false);
      return sliderExemplar.model.getState();
    },
  });

  export interface JQuery{
    createSlider();
  }
}

export default {
  Slider,
};
