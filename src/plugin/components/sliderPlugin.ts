import { availableOptions, Axis, ValueType } from './types/types';
import MainView from './View/MainView';
import Model from './Model/Model';
import Controller from './Controller/Controller';

(function ($) {
  const methods = {
    _init(args) {
      const initSliderOptions: availableOptions = {
        stepSize: 1,
        minAvailableValue: 1,
        maxAvailableValue: 100,
        minValueCurrent: 1,
        maxValueCurrent: 100,
        axis: 'X',
        withLabels: true,
        withTooltip: true,
        valueType: 'single',
      };

      Object.keys(args).forEach((setting) => {
        initSliderOptions[setting] = args[setting];
      });

      const model = new Model(initSliderOptions);
      const view = new MainView(model, this);
      const controller = new Controller(model, view);
      this.data('controller', controller);

      setTimeout(() => {
        controller.changeStateByItemName('min-value', args.minValueCurrent);
        controller.changeStateByItemName('max-value', args.maxValueCurrent);
      }, 0);

      return this;
    },
  };
  $.fn.extend({
    sliderPlugin<T>(method: string, ...args: T[]): JQuery<HTMLElement> {
      const currentController = this.data('controller') || {};

      if (currentController[method]) {
        return currentController[method].call(currentController, ...args) || this;
      }

      if (typeof method === 'object' || !method) {
        return methods._init.apply(this, [method]);
      }

      return this;
    },
  });
}(jQuery));
