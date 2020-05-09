import Observer from '../Observer/Observer';
import ValidateModel from './ValidateModel/ValidateModel';

type modelOptions = {
  isShowLabels: boolean,
  isEnabledTooltip: boolean,
  axis: string,
  valueType: string,
  minValue: number,
  maxValue: number,
  stepSize: number,
}

class Model {
  public state: object;
  public axis: string;
  public minValue: number;
  public maxValue: number;
  public valueType: string;
  public stepSize: number;
  public isEnabledTooltip: boolean;
  public breakPoints: Array<number>;
  public eventObserver: Observer;
  public isShowLabels: boolean;
  public validate: ValidateModel;

  constructor(options: modelOptions) {
    this.validate = new ValidateModel;
    this.eventObserver = new Observer();
    this.state = {};
    this.isShowLabels = options.isShowLabels;
    this.axis = options.axis || this.validate.axisX;
    this.valueType = options.valueType || this.validate.singleValue;
    this.isEnabledTooltip = options.isEnabledTooltip;
    this.minValue = options.minValue || 0;
    this.maxValue = options.maxValue || 100;
    this.stepSize = this.minValue;
    this.breakPoints = this.updateBreakpointList();

    this.setStepSize(options.stepSize);
  }

  public setValueType(valueType: string): void {
    this.valueType = valueType;

    console.log(this.valueType);

    this.eventObserver.broadcast({ axis: this.valueType, name: 'SET_VALUE_TYPE' });
  }

  public setAxis(axis: string) {
    this.axis = axis;

    this.eventObserver.broadcast({ axis: this.axis, name: 'SET_AXIS' });
  }

  public setLabelsActivity(isLabelsActive: boolean): void {
    this.isShowLabels = isLabelsActive;

    this.eventObserver.broadcast({ isLabelsActive, name: 'SET_LABELS_ACTIVITY' });
  }

  public showTooltip(): void {
    this.isEnabledTooltip = true;

    this.eventObserver.broadcast({ isEnabledTooltip: this.isEnabledTooltip, name: 'SET_TOOLTIP_ACTIVITY' });
  }

  public hideTooltip(): void {
    this.isEnabledTooltip = false;

    this.eventObserver.broadcast({ isEnabledTooltip: this.isEnabledTooltip, name: 'SET_TOOLTIP_ACTIVITY' });
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

  public setMinValue(value: number): object {
    if (value < this.maxValue) {
      this.minValue = value;
      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ minValue: this.minValue, name: 'SET_MIN_VALUE' });
      return { response: 'success', message: `Минимальное значение установлено на ${value}` };
    } else {
      return { response: 'error', message: 'Невалидное значения. Минимальное значение не может быть больше чем максимальное.' };
    }
  }

  public setMaxValue(value: number): object {
    if (value > this.minValue) {
      this.maxValue = value;
      this.updateBreakpointList();
      this.refreshState();
      this.eventObserver.broadcast({ maxValue: this.maxValue, name: 'SET_MAX_VALUE' });

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

  private checkIncludeStateValue($targetElement: JQuery<HTMLElement>): boolean {
    let isFoundItem: boolean = false;

    Object.values(this.state).map((stateElement) => {
      if (stateElement.$handler[0] === $targetElement[0]) {
        isFoundItem = true;
      }
      return false;
    });

    return isFoundItem;
  }

  private checkCollision(): void {
    let minValue = this.state[0].value;
    let maxValue = this.state[Object.keys(this.state).length - 1].value;

    if (minValue > maxValue) {
      this.state[Object.keys(this.state).length - 1].value = minValue;
    }

    if (maxValue < minValue) {
      this.state[0].value = maxValue
    }
  }

  private calculateNewState(newState): number {
    let theClosest = Infinity;
    let temp, arrayElement;

    this.breakPoints.map((_element, i) => {
      temp = Math.abs(this.breakPoints[i] - newState);

      if (temp < theClosest) {
        theClosest = temp;
        arrayElement = this.breakPoints[i];
      }
    });

    return arrayElement;
  }

  public setState(newState): void {
    if (!this.checkIncludeStateValue(newState.$handler)) {
      this.state[Object.keys(this.state).length] = newState;
    }
    this.checkCollision();

    Object.values(this.state).map((stateElement) => {
      if (stateElement.$handler[0] === newState.$handler[0]) {
        stateElement.value = this.calculateNewState(newState.value);
      }
    });

    // console.log(this.state);

    this.eventObserver.broadcast({ state: this.state, name: 'SET_STATE' });
  }

  public clearState(): void {
    this.state = {};
  }

  public refreshState(): void {
    const currentState = this.getState();
    Object.values(currentState).map((item, _index) => {
      this.setState(item);
    });

    this.eventObserver.broadcast({ state: this.state, name: 'SET_STATE' });
  }

  public setStepSize(newStepSize: number): object {
    if (newStepSize <= this.maxValue) {
      this.stepSize = Number(newStepSize);
      this.updateBreakpointList();

      this.refreshState();

      this.eventObserver.broadcast({ newBreakpoints: this.breakPoints, name: 'SET_STEP_SIZE' });
      return { response: 'success', message: `Размер шага установлен на ${newStepSize}` };
    } else {
      return { response: 'error', message: `Размер шага должен быть от 1 до ${this.maxValue}` };
    }

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
}

export default Model;
