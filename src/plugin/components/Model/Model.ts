import Observer from '../Observer/Observer';
import * as ValidateModel from './ValidateModel/ValidateModel';
import * as customEvent from '../Observer/customEvents';
import { modelOptions, handlerData } from '../types/types';

class Model {
  public isShowLabels: boolean;
  public isEnabledTooltip: boolean;
  public axis: string;
  public valueType: string;
  public state: object;
  public minValue: number;
  public maxValue: number;
  public stepSize: number;
  public breakPoints: Array<number>;
  public eventObserver: Observer;

  constructor(options: modelOptions) {
    this.eventObserver = new Observer();
    this.state = {};
    this.isShowLabels = options.isShowLabels || true;
    this.axis = options.axis || ValidateModel.axisX;
    this.valueType = options.valueType || ValidateModel.singleValue;
    this.isEnabledTooltip = options.isEnabledTooltip || true;
    this.minValue = options.minValue || 0;
    this.maxValue = options.maxValue || 100;
    this.stepSize = this.minValue;
    this.breakPoints = this.updateBreakpointList();

    this.setStepSize(options.stepSize);
  }

  public setValueType(valueType: string): void {
    this.valueType = valueType;

    this.eventObserver.broadcast({ type: customEvent.setValueType, data: { axis: this.valueType } });
  }

  public setAxis(axis: string) {
    this.axis = axis;

    this.eventObserver.broadcast({ type: customEvent.setAxis, data: { axis: this.axis } });
  }

  public setLabelsActivity(isLabelsActive: boolean): void {
    this.isShowLabels = isLabelsActive;

    this.eventObserver.broadcast({ type: customEvent.setLabelsActivity, data: { isLabelsActive } });
  }

  public showTooltip(): void {
    this.isEnabledTooltip = true;

    this.eventObserver.broadcast({ type: customEvent.setTooltipActivity, data: { isEnabledTooltip: this.isEnabledTooltip } });
  }

  public hideTooltip(): void {
    this.isEnabledTooltip = false;

    this.eventObserver.broadcast({ type: customEvent.setTooltipActivity, data: { isEnabledTooltip: this.isEnabledTooltip } });
  }

  public getOption(targetOption: string) {
    const modelOptions: object = this.getOptionList();

    for (let option in modelOptions) {
      return modelOptions[targetOption];
    }
  }

  public getState(): object {
    return this.state;
  }

  public setMinValue(value: number): object {
    if (value <= this.maxValue) {
      this.minValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: customEvent.setMinValue, data: { minValue: this.minValue } });

      return { response: 'success', message: `Минимальное значение установлено на ${value}` };
    } else {
      return { response: 'error', message: 'Невалидное значения. Минимальное значение не может быть больше чем максимальное.' };
    }
  }

  public setMaxValue(value: number): object {
    if (value >= this.minValue) {
      this.maxValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: customEvent.setMaxValue, data: { maxValue: this.maxValue } });

      return { response: 'success', message: `Максимальное значение установлено на ${value}` };
    } else {
      return { response: 'error', message: 'Невалидное значения. Максимальное значение не может быть меньше чем минимальное.' };
    }
  }

  public updateBreakpointList(): number[] {
    const stepsBreakpointList: number[] = [];
    let breakPoint: number = this.minValue;

    while (breakPoint <= this.maxValue) {
      stepsBreakpointList.push(breakPoint);
      breakPoint = breakPoint + this.stepSize;
    }

    this.breakPoints = stepsBreakpointList;

    return this.breakPoints;
  }

  public changeStateByHandlerName(handlerName: string, value: number): void {
    Object.values(this.state).map((stateElement: handlerData) => {
      if (stateElement.name === handlerName) {
        stateElement.value = this.findTheClosestBreakpoint(Number(value));
      }
    });

    this.checkCollision();

    this.eventObserver.broadcast({ type: customEvent.setState, data: { state: this.state } });
  }

  public setState(newState: handlerData): void {
    const stateLength = this.getStateLength();

    if (!this.checkIncludeStateValue(newState.$handler)) {
      this.state[stateLength] = newState;
    }

    this.checkCollision();

    Object.values(this.state).map((stateElement: handlerData) => {
      if (stateElement.$handler[0] === newState.$handler[0]) {
        stateElement.value = this.findTheClosestBreakpoint(newState.value);
      }
    });

    this.eventObserver.broadcast({ type: customEvent.setState, data: { state: this.state } });
  }

  public clearState(): void {
    this.state = {};
  }

  public refreshState(): void {
    const currentState: object = this.getState();

    Object.values(currentState).map((item, _index) => {
      this.setState(item);
    });

    this.eventObserver.broadcast({ type: customEvent.setState, data: { state: this.state } });
  }

  public setStepSize(newStepSize: number): object {
    if (newStepSize <= this.maxValue || newStepSize < 1) {
      this.stepSize = Number(newStepSize);

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: customEvent.setStepSize, data: { newBreakpoints: this.breakPoints } });

      return { response: 'success', message: `Размер шага установлен на ${newStepSize}` };
    } else {
      return { response: 'error', message: `Размер шага должен быть от 1 до ${this.maxValue}` };
    }
  }

  private getOptionList() {
    const optionList = {
      axis: this.axis,
      valueType: this.valueType,
      minValue: this.minValue,
      maxValue: this.maxValue,
      stepSize: this.stepSize,
      breakpoints: this.breakPoints,
      isEnabledTooltip: this.isEnabledTooltip,
      isShowLabels: this.isShowLabels,
    }

    return optionList;
  }

  private checkIncludeStateValue($targetElement: JQuery<HTMLElement>): boolean {
    let isFoundItem: boolean = false;

    Object.values(this.state).map((stateElement: handlerData) => {
      if (stateElement.$handler[0] === $targetElement[0]) {
        isFoundItem = true;
      }
      return false;
    });

    return isFoundItem;
  }

  private getStateLength(): number {
    return Object.keys(this.state).length;
  }

  private checkCollision(): void {
    const stateLength = this.getStateLength();
    const minValue: number = this.state[0].value;
    const maxValue: number = this.state[stateLength - 1].value;

    if (minValue > maxValue) {
      this.state[stateLength - 1].value = minValue;
      this.state[0].value = maxValue
    }
  }

  private findTheClosestBreakpoint(newStateValue: number): number {
    let theClosest = Infinity;
    let temp, arrayElement;

    this.breakPoints.map((_element, index) => {
      temp = Math.abs(this.breakPoints[index] - newStateValue);

      if (temp < theClosest) {
        theClosest = temp;
        arrayElement = this.breakPoints[index];
      }
    });

    return arrayElement;
  }
}

export default Model;
