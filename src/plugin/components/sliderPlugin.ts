/* eslint-disable @typescript-eslint/class-name-casing */
import MainView from './View/MainView';
import Model from './Model/Model';
import Controller from './Controller/Controller';
import * as customEvent from './Observer/customEvents';
import { initSlider, observerEvent, stateListener } from './types/types';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace sliderPlugin {
  jQuery.fn.extend({
    sliderPlugin(args: initSlider) {
      const {
        stepSize = -50,
        minValue = 1,
        maxValue = 100,
        axis = 'X',
        isShowLabels = true,
        isEnabledTooltip = true,
        valueType = 'singleValue',
      } = args;

      this.model = new Model({
        stepSize,
        minValue,
        maxValue,
        axis,
        isShowLabels,
        isEnabledTooltip,
        valueType,
      });
      this.view = new MainView(this.model, this);
      this.controller = new Controller(this.model, this.view);

      return this;
    },

    setValueType(valueType: string): void {
      this.controller.setValueType(valueType);
    },

    showLabels(): void {
      this.controller.showLabels();
    },

    hideLabels(): void {
      this.controller.hideLabels();
    },

    setStepSize(stepSize: number | Array<number>): void | object {
      return this.controller.setStepSize(stepSize);
    },

    setMinValue(value: number): void | object {
      return this.controller.setMinValue(value);
    },

    setMaxValue(value: number): void | object {
      return this.controller.setMaxValue(value);
    },

    setAxis(axis: string): void {
      this.controller.setAxis(axis);
    },

    showTooltip(): void {
      this.controller.showTooltip();
    },

    hideTooltip(): void {
      this.controller.hideTooltip();
    },

    changeStateByHandlerName(handlerName: string, newValue: number): void {
      this.controller.changeStateByHandlerName(handlerName, newValue);
    },

    listenToChangeState(callback) {
      this.controller.subscribeToChangeState();

      this.controller.eventObserver.subscribe((event: observerEvent<stateListener>) => {
        if (event.type === customEvent.setState) {
          callback(event.data.state);
        }
      });
    },
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
