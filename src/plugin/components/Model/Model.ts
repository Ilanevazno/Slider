/* eslint-disable no-param-reassign */
import Observer from '../Observer/Observer';
import * as ValidateModel from './ValidateModel/ValidateModel';
import СustomEvents from '../Observer/CustomEvents';
import { availableOptions, stateHandler, modelResponse } from '../types/types';
import ModelValidator from './ValidateModel/ValidateModel';

class Model {
  public withLabels: boolean;

  public withTooltip: boolean;

  public axis: string;

  public valueType: string;

  public state: stateHandler[];

  public minValue: number;

  public maxValue: number;

  public stepSize: number;

  public breakPoints: Array<number>;

  public eventObserver: Observer;

  constructor(options: availableOptions) {
    this.eventObserver = new Observer();
    this.state = [];
    this.withLabels = options.withLabels || false;
    this.axis = options.axis || ValidateModel.axisX;
    this.valueType = options.valueType || ValidateModel.singleValue;
    this.withTooltip = options.withTooltip || false;
    this.minValue = options.minValue || 0;
    this.maxValue = options.maxValue || 100;
    this.stepSize = options.stepSize || 1;
    this.breakPoints = this.updateBreakpointList();

    this.setStepSize(options.stepSize);
  }

  public setValueType(valueType: string): void {
    this.valueType = valueType;

    this.eventObserver.broadcast({ type: СustomEvents.SetValueType, data: { axis: this.valueType } });
  }

  public setAxis(axis: string) {
    this.axis = axis;

    this.eventObserver.broadcast({ type: СustomEvents.SetAxis, data: { axis: this.axis } });
  }

  public setLabelsActivity(isLabelsActive: boolean): void {
    this.withLabels = isLabelsActive;

    this.eventObserver.broadcast({ type: СustomEvents.SetLabelsActivity, data: { isLabelsActive } });
  }

  public showTooltip(): void {
    this.withTooltip = true;

    this.eventObserver.broadcast({ type: СustomEvents.SetTooltipActivity, data: { withTooltip: this.withTooltip } });
  }

  public hideTooltip(): void {
    this.withTooltip = false;

    this.eventObserver.broadcast({ type: СustomEvents.SetTooltipActivity, data: { withTooltip: this.withTooltip } });
  }

  public getOption(targetOption: string): any {
    const availableOptionsList: object = this.getOptionList();

    return availableOptionsList[targetOption];
  }

  public getState(): stateHandler[] {
    return this.state;
  }

  public setMinValue(value: number): modelResponse {
    if (value <= this.maxValue) {
      this.minValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: СustomEvents.SetMinValue, data: { minValue: this.minValue } });

      return {
        response: ModelValidator.SuccessResponse,
        message: `Минимальное значение установлено на ${value}`,
      };
    }
    return {
      response: ModelValidator.FailedResponse,
      message: 'Невалидное значения. Минимальное значение не может быть больше чем максимальное.',
    };
  }

  public setMaxValue(value: number): modelResponse {
    if (value >= this.minValue) {
      this.maxValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: СustomEvents.SetMaxValue, data: { maxValue: this.maxValue } });

      return {
        response: ModelValidator.SuccessResponse,
        message: `Максимальное значение установлено на ${value}`,
      };
    }
    return {
      response: ModelValidator.FailedResponse,
      message: 'Невалидное значения. Максимальное значение не может быть меньше чем минимальное.',
    };
  }

  public updateBreakpointList(): number[] {
    const stepsBreakpointList: number[] = [];
    let breakPoint: number = this.minValue;

    while (breakPoint <= this.maxValue) {
      stepsBreakpointList.push(breakPoint);
      breakPoint += Math.abs(this.stepSize);
    }

    this.breakPoints = stepsBreakpointList;

    return this.breakPoints;
  }

  public changeStateByHandlerName(handlerName: string, value: number): void {
    this.state.map((stateElement: stateHandler) => {
      if (stateElement.name === handlerName) {
        stateElement.value = this.findTheClosestBreakpoint(Number(value));
      }
      return stateElement;
    });

    this.checkCollision(handlerName);

    this.eventObserver.broadcast({ type: СustomEvents.SetState, data: { state: this.state } });
  }

  public setState(currentHandler: stateHandler): void {
    const stateLength = this.getStateLength();

    if (!this.checkIncludeStateValue(currentHandler.$handler)) {
      this.state[stateLength] = currentHandler;
    }

    this.checkCollision(currentHandler.name);

    this.state.map((stateElement: stateHandler) => {
      if (stateElement.$handler[0] === currentHandler.$handler[0]) {
        stateElement.value = this.findTheClosestBreakpoint(currentHandler.value);
      }

      return stateElement;
    });

    this.eventObserver.broadcast({ type: СustomEvents.SetState, data: { state: this.state } });
  }

  public clearState(): void {
    this.state = [];
  }

  public refreshState(): void {
    this.state.map((item) => {
      this.setState(item);
      return item;
    });

    this.eventObserver.broadcast({ type: СustomEvents.SetState, data: { state: this.state } });
  }

  public setStepSize(newStepSize: number): modelResponse {
    const convertedNewStepSize = Math.abs(newStepSize);
    const convertedMaxValue = Math.abs(this.maxValue);

    if (convertedNewStepSize <= convertedMaxValue && convertedNewStepSize > 0) {
      this.stepSize = Number(convertedNewStepSize);

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: СustomEvents.SetStepSize, data: { newBreakpoints: this.breakPoints } });

      return {
        response: ModelValidator.SuccessResponse,
        message: `Размер шага установлен на ${convertedNewStepSize}`,
      };
    }
    return {
      response: ModelValidator.FailedResponse,
      message: `Размер шага должен быть от 1 до ${convertedMaxValue}`,
    };
  }

  private getOptionList() {
    const optionList = {
      axis: this.axis,
      valueType: this.valueType,
      minValue: this.minValue,
      maxValue: this.maxValue,
      stepSize: this.stepSize,
      breakpoints: this.breakPoints,
      withTooltip: this.withTooltip,
      withLabels: this.withLabels,
    };

    return optionList;
  }

  private checkIncludeStateValue($targetElement: JQuery<HTMLElement>): boolean {
    let isFoundItem = false;

    this.state.map((stateElement: stateHandler) => {
      if (stateElement.$handler[0] === $targetElement[0]) {
        isFoundItem = true;
      }
      return false;
    });

    return isFoundItem;
  }

  private getStateLength(): number {
    return this.state.length;
  }

  private checkCollision(currentHandler): void {
    const stateLength: number = this.getStateLength();
    const minValue: number = this.state[0].value;
    const maxValue: number = this.state[stateLength - 1].value;


    if (currentHandler === 'min-value') {
      this.state[stateLength - 1].value = minValue > maxValue ? this.state[0].value : this.state[stateLength - 1].value;
    }

    if (currentHandler === 'max-value') {
      this.state[0].value = maxValue < minValue ? this.state[stateLength - 1].value : this.state[0].value;
    }
  }

  private findTheClosestBreakpoint(newStateValue: number): number {
    let theClosest = Infinity;
    let temp; let
      arrayElement;

    this.breakPoints.map((element, index) => {
      temp = Math.abs(this.breakPoints[index] - newStateValue);

      if (temp < theClosest) {
        theClosest = temp;
        arrayElement = this.breakPoints[index];
      }

      return element;
    });

    return arrayElement;
  }
}

export default Model;
