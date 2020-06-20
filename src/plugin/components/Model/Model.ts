import {
  availableOptions,
  unconvertedStateItem,
  ModelResponse,
  CustomEvents,
  Response,
  ValueType,
  Axis,
} from '../types/types';
import Observer from '../Observer/Observer';

class Model {
  public withLabels: boolean;

  public withTooltip: boolean;

  public axis: Axis;

  public valueType: ValueType;

  public state: object;

  public minAvailableValue: number;

  public maxAvailableValue: number;

  public stepSize: number;

  public breakPoints: number[];

  public eventObserver: Observer;

  constructor(options: availableOptions) {
    this.eventObserver = new Observer();
    this.state = {};
    this.withLabels = options.withLabels;
    this.axis = options.axis;
    this.valueType = options.valueType;
    this.withTooltip = options.withTooltip;
    this.minAvailableValue = options.minAvailableValue;
    this.maxAvailableValue = options.maxAvailableValue;
    this.stepSize = options.stepSize;
    this.breakPoints = this.updateBreakpointList();

    this.setStepSize(options.stepSize);
  }

  public setValueType(valueType: ValueType): void {
    this.valueType = valueType;

    this.eventObserver.broadcast({ type: CustomEvents.VALUE_TYPE_CHANGED, data: { valueType: this.valueType } });
  }

  public setAxis(axis: Axis) {
    this.axis = axis;

    this.eventObserver.broadcast({ type: CustomEvents.AXIS_CHANGED, data: { axis: this.axis } });
  }

  public setLabelsActivity(isLabelsActive: boolean): void {
    this.withLabels = isLabelsActive;

    this.eventObserver.broadcast({ type: CustomEvents.LABELS_ACTIVITY_CHANGED, data: { isLabelsActive } });
  }

  public setTooltipActivity(isActive: boolean): void {
    this.withTooltip = isActive;

    this.eventObserver.broadcast({ type: CustomEvents.TOOLTIP_ACTIVITY_CHANGED, data: { withTooltip: this.withTooltip } });
  }


  public getOption<T>(targetOption: string): T {
    const OptionsList: object = this.getOptionList();


    return OptionsList[targetOption];
  }

  public getState(): object {
    return this.state;
  }

  public setMinAvailableValue(value: number): ModelResponse {
    if (value <= this.maxAvailableValue) {
      this.minAvailableValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: CustomEvents.MIN_VALUE_CHANGED, data: { minAvailableValue: this.minAvailableValue } });

      return {
        response: Response.SUCCESS,
        message: `Минимальное значение установлено на ${value}`,
      };
    }
    return {
      response: Response.ERROR,
      message: 'Невалидное значение. Минимальное значение не может быть больше чем максимальное.',
    };
  }

  public setMaxAvailableValue(value: number): ModelResponse {
    if (value >= this.minAvailableValue) {
      this.maxAvailableValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: CustomEvents.MAX_VALUE_CHANGED, data: { maxAvailableValue: this.maxAvailableValue } });

      return {
        response: Response.SUCCESS,
        message: `Максимальное значение установлено на ${value}`,
      };
    }
    return {
      response: Response.ERROR,
      message: 'Невалидное значение. Максимальное значение не может быть меньше чем минимальное.',
    };
  }

  public updateBreakpointList(): number[] {
    const stepsBreakpointList: number[] = [];
    let breakPoint: number = this.minAvailableValue;

    while (breakPoint <= this.maxAvailableValue) {
      stepsBreakpointList.push(breakPoint);
      breakPoint += Math.abs(this.stepSize);
    }

    this.breakPoints = stepsBreakpointList;

    return this.breakPoints;
  }

  public changeStateByItemName(name: string, value: number): void {
    this.setState({ value, name });

    if (Object.keys(this.state).length > 1) {
      this.checkCollision(name);
    }

    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public setState(targetStateItem: unconvertedStateItem): void {
    if (!this.checkIncludeStateValue(targetStateItem.name)) {
      this.state[targetStateItem.name] = { value: targetStateItem.value };
    }

    if (Object.keys(this.state).length > 1) {
      this.checkCollision(targetStateItem.name);
    }

    this.state[targetStateItem.name].value = this.findTheClosestBreakpoint(targetStateItem.value);
    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public clearState(): void {
    this.state = {};
  }

  public refreshState(): void {
    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public setStepSize(newStepSize: number): ModelResponse {
    const convertedNewStepSize = Math.abs(newStepSize);
    const convertedMaxValue = Math.abs(this.maxAvailableValue);

    if (convertedNewStepSize <= convertedMaxValue && convertedNewStepSize > 0) {
      this.stepSize = Number(convertedNewStepSize);

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: CustomEvents.STEP_SIZE_CHANGED, data: { newBreakpoints: this.breakPoints } });

      return {
        response: Response.SUCCESS,
        message: `Размер шага установлен на ${convertedNewStepSize}`,
      };
    }
    return {
      response: Response.ERROR,
      message: `Размер шага должен быть от 1 до ${convertedMaxValue}`,
    };
  }

  private getOptionList(): availableOptions {
    return {
      axis: this.axis,
      valueType: this.valueType,
      minAvailableValue: this.minAvailableValue,
      maxAvailableValue: this.maxAvailableValue,
      minValueCurrent: this.state['min-value'] ? this.state['min-value'].value : 'Значение не найдено',
      maxValueCurrent: this.state['max-value'] ? this.state['max-value'].value : 'Значение не найдено',
      stepSize: this.stepSize,
      breakpoints: this.breakPoints,
      withTooltip: this.withTooltip,
      withLabels: this.withLabels,
    } as availableOptions;
  }

  private checkIncludeStateValue(targetElement: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.state, targetElement);
  }

  private checkCollision(currentStateItem): void {
    const firstStateItemCurrent: number = this.state['min-value'].value;
    const lastStateItemCurrent: number = this.state['max-value'].value;

    if (currentStateItem === 'min-value') {
      this.state['max-value'].value = firstStateItemCurrent > lastStateItemCurrent
        ? firstStateItemCurrent
        : lastStateItemCurrent;
    }

    if (currentStateItem === 'max-value') {
      this.state['min-value'].value = lastStateItemCurrent < firstStateItemCurrent
        ? lastStateItemCurrent
        : firstStateItemCurrent;
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
