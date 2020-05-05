import View from './components/View/View';
import Model from './components/Model/Model';
import Controller from './components/Controller/Controller';
import Observer from './components/Observer/Observer';

type argsForDrawSlider = {
  stepSize: number,
}

namespace sliderPlugin {
  // const model = '';
  jQuery.fn.extend({
    model: null,
    view: null,
    controller: null,
    observer: new Observer,

    sliderPlugin (args) {
      // console.log(args);
      const {
        stepSize = 10,
        minValue = 5,
        maxValue = 100,
        axis = 'X',
      } = args;

      const options = {
        isShowLabels: true,
        isEnabledTooltip: false,
        axis: axis,
        stepSize,
        valueType: 'singleValue',
        minValue: minValue,
        maxValue: maxValue,
      }

      this.model = new Model(options);
      this.view = new View(this.model, this);
      this.controller = new Controller(this.model, this.view);

      return this;
    },

    setStepSize (stepSize: number | Array<number>): void {
      this.controller.setStepSize(stepSize);
    },

    setMinValue (value: number): void {
      this.controller.setMinValue(value);
    },

    setMaxValue (value: number): void {
      this.controller.setMaxValue(value);
    },

    setAxis (axis: string): void {
      this.controller.setAxis(axis);
    },

    showTooltip (): void {
      this.controller.showTooltip();
    },

    hideTooltip (): void {
      this.controller.hideTooltip();
    }
  });

  export interface jQuery {
    sliderPlugin(args);
    setStepSize(newStep: number);
    setMinValue(value: number);
    setMaxValue(value: number);
    setAxis(axis: string);
    showTooltip();
    hideTooltip();
  }
}

export default sliderPlugin;