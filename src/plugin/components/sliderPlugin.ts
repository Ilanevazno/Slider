import MainView from './View/MainView';
import Model from './Model/Model';
import Controller from './Controller/Controller';
import { Options } from './types/types';

(function ($) {
  const methods = {
    _init(args) {
      const initSliderOptions: Options = {
        stepSize: 1,
        minValue: 1,
        maxValue: 100,
        minValueCurrent: 1,
        maxValueCurrent: 100,
        axis: 'X',
        withLabels: true,
        withTooltip: true,
        valueType: 'single',
      };

      Object.keys(args).map((setting) => {
        initSliderOptions[setting] = args[setting];
        return setting;
      });

      const model = new Model(initSliderOptions);
      const view = new MainView(model, this);
      const controller = new Controller(model, view);
      this.data('controller', controller);

      setTimeout(() => {
        model.changeStateByHandlerName('min-value', args.minValueCurrent);
        model.changeStateByHandlerName('max-value', args.maxValueCurrent);
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
