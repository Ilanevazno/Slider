import {
  AvailableOptions,
  UnconvertedStateItem,
  CustomEvents,
  ValueType,
  Axis,
  ModelState,
} from '../types/types';
import Observer from '../Observer/Observer';

class Model {
  public withLabels: boolean;

  public withTooltip: boolean;

  public axis: Axis;

  public valueType: ValueType;

  public state: ModelState;

  public minAvailableValue: number;

  public maxAvailableValue: number;

  public stepSize: number;

  public breakpoints: number[];

  public eventObserver: Observer;

  constructor(options: AvailableOptions) {
    this.prepareModelData(options);
    this.callInitialMethods(options);
  }

  public setValueType(valueType: ValueType): void {
    if (valueType === ValueType.SINGLE || valueType === ValueType.DOUBLE) {
      this.valueType = valueType;
      this.eventObserver.broadcast({ type: CustomEvents.VALUE_TYPE_CHANGED, data: { valueType: this.valueType } });
    } else {
      throw new Error(`Невалидное типа значения: ${valueType}`);
    }
  }

  public setAxis(axis: Axis): void {
    if (axis === 'X' || axis === 'Y') {
      this.axis = axis;

      this.eventObserver.broadcast({ type: CustomEvents.AXIS_CHANGED, data: { axis: this.axis } });
    } else {
      throw new Error(`Невалидный тип отображения ${axis}`);
    }
  }

  public setLabelsAvailability(isLabelsActive: boolean): void {
    this.withLabels = isLabelsActive;

    this.eventObserver.broadcast({ type: CustomEvents.LABELS_AVAILABILITY_CHANGED, data: { isLabelsActive } });
  }

  public setTooltipAvailability(isActive: boolean): void {
    this.withTooltip = isActive;

    this.eventObserver.broadcast({ type: CustomEvents.TOOLTIP_AVAILABILITY_CHANGED, data: { withTooltip: this.withTooltip } });
  }

  public getOption<T>(targetOption: string): T {
    const optionsList: object = this.getOptionList();

    return optionsList[targetOption];
  }

  public getState(): ModelState {
    return { ...this.state };
  }

  public updateBreakpointList(): number[] {
    const stepsBreakpointList: number[] = [];
    let breakpoint: number = this.minAvailableValue;

    while (breakpoint <= this.maxAvailableValue) {
      stepsBreakpointList.push(breakpoint);
      breakpoint += Math.abs(this.stepSize);
    }

    this.breakpoints = stepsBreakpointList;

    return this.breakpoints;
  }

  public setState({ name, value }: UnconvertedStateItem): void {
    this.state[name] = this.findClosestBreakpoint(value);

    const withCollision = this.checkStateForCollisions(name);

    if (!withCollision) {
      this.eventObserver.broadcast({
        type: CustomEvents.STATE_CHANGED,
        data: {
          state: {
            [name]: this.state[name],
          },
        },
      });
    }
  }

  public setStepSize(newStepSize: number): void {
    const convertedNewStepSize = Math.abs(newStepSize);
    const convertedMaxValue = Math.abs(this.maxAvailableValue);

    if (convertedNewStepSize <= convertedMaxValue && convertedNewStepSize > 0) {
      this.stepSize = Number(convertedNewStepSize);

      this.updateBreakpointList();

      this.eventObserver.broadcast({ type: CustomEvents.STEP_SIZE_CHANGED, data: { newBreakpoints: this.breakpoints } });
    } else {
      throw new Error(`Размер шага должен быть от 1 до ${convertedMaxValue}`);
    }
  }

  public setMinAvailableValue(value: number): void {
    if (value <= this.maxAvailableValue) {
      this.minAvailableValue = value;
      this.updateBreakpointList();

      this.eventObserver.broadcast({ type: CustomEvents.MIN_AVAILABLE_VALUE_CHANGED, data: { minAvailableValue: this.minAvailableValue } });
    } else {
      throw new Error('Минимальное значение не может быть больше чем максимальное.');
    }
  }

  public setMaxAvailableValue(value: number): void {
    if (value >= this.minAvailableValue) {
      this.maxAvailableValue = value;

      this.updateBreakpointList();

      this.eventObserver.broadcast({ type: CustomEvents.MAX_AVAILABLE_VALUE_CHANGED, data: { maxAvailableValue: this.maxAvailableValue } });
    } else {
      throw new Error('Максимальное значение не может быть меньше минимального.');
    }
  }

  private getOptionList(): AvailableOptions {
    return {
      axis: this.axis,
      valueType: this.valueType,
      minAvailableValue: this.minAvailableValue,
      maxAvailableValue: this.maxAvailableValue,
      minCurrentValue: this.state.minValue || 'Значение не найдено',
      maxCurrentValue: this.state.maxValue || 'Значение не найдено',
      stepSize: this.stepSize,
      breakpoints: this.breakpoints,
      withTooltip: this.withTooltip,
      withLabels: this.withLabels,
    } as AvailableOptions;
  }

  private callInitialMethods(options: AvailableOptions) {
    this.setMinAvailableValue(options.minAvailableValue);
    this.setMaxAvailableValue(options.maxAvailableValue);
    this.setStepSize(options.stepSize);
    this.setValueType(options.valueType);
    this.setAxis(options.axis);
  }

  private prepareModelData(options: AvailableOptions) {
    this.eventObserver = new Observer();
    this.state = {};
    this.withLabels = options.withLabels;
    this.axis = options.axis;
    this.valueType = options.valueType;
    this.withTooltip = options.withTooltip;
    this.minAvailableValue = options.minAvailableValue;
    this.maxAvailableValue = options.maxAvailableValue;
    this.stepSize = options.stepSize;
    this.breakpoints = this.updateBreakpointList();
  }

  private checkStateForCollisions(checkableStateItem): boolean {
    const {
      minValue,
      maxValue,
    } = this.state;

    let isCaughtCollision = false;

    if (checkableStateItem === 'minValue' && minValue > maxValue) {
      isCaughtCollision = true;
      this.state.maxValue = minValue;
    }

    if (checkableStateItem === 'maxValue' && maxValue < minValue) {
      this.state.minValue = maxValue;
      isCaughtCollision = true;
    }

    if (isCaughtCollision) {
      this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
    }

    return isCaughtCollision;
  }

  private findClosestBreakpoint(target: number): number {
    let newTarget: number = this.minAvailableValue;

    this.breakpoints.find((currentValue, index) => {
      const nextValue: number = this.breakpoints[index + 1];
      const halfValue: number = nextValue - ((nextValue - currentValue) / 2);

      if (target > halfValue) newTarget = nextValue;
      return false;
    });

    return newTarget;
  }
}

export default Model;
