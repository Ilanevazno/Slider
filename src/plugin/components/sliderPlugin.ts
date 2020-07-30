import { AvailableOptions, ValueType } from './types/types';
import MainView from './View/MainView';
import Model from './Model/Model';
import Controller from './Controller/Controller';

(function ($) {
  const methods = {
    _init(args: AvailableOptions) {
      const initSliderOptions: AvailableOptions = {
        stepSize: 1,
        minAvailableValue: 1,
        maxAvailableValue: 100,
        minCurrentValue: 1,
        maxCurrentValue: 100,
        axis: 'X',
        withLabels: true,
        withTooltip: true,
        valueType: ValueType.SINGLE,
        ...args,
      };

      const model = new Model(initSliderOptions);
      const view = new MainView(model, this);
      const controller = new Controller(model, view);
      this.data('controller', controller);

      setTimeout(() => {
        controller.changeStateByItemName('minValue', args.minCurrentValue);

        if (initSliderOptions.valueType === 'double') {
          controller.changeStateByItemName('maxValue', args.maxCurrentValue);
        }
      }, 0);

      return this;
    },
  };
  $.fn.extend({
    sliderPlugin<T>(method: keyof AvailableOptions | AvailableOptions, ...args: T[]): JQuery<HTMLElement> {
      const currentController = this.data('controller') || {};

      if (currentController[method as keyof AvailableOptions]) {
        return currentController[method as keyof AvailableOptions].call(currentController, ...args) || this;
      }

      if (typeof method === 'object' || !method) {
        return methods._init.apply(this, [method as AvailableOptions]);
      }

      return this;
    },
  });
}(jQuery));
