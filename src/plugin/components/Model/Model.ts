import {
  AvailableOptions,
  UnconvertedStateItem,
  ModelResponse,
  CustomEvents,
  Response,
  ValueType,
  Axis,
  ModelState,
  HandlerName,
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

  public setValueType(valueType: ValueType): ModelResponse<string> {
    if (valueType === ValueType.SINGLE || valueType === ValueType.DOUBLE) {
      this.valueType = valueType;
      this.eventObserver.broadcast({ type: CustomEvents.VALUE_TYPE_CHANGED, data: { valueType: this.valueType } });

      return {
        response: Response.SUCCESS,
        message: `Тип значения установлен на ${valueType}`,
        newValue: valueType,
      };
    }

    this.valueType = ValueType.SINGLE;
    this.eventObserver.broadcast({ type: CustomEvents.VALUE_TYPE_CHANGED, data: { valueType: this.valueType } });

    return {
      response: Response.ERROR,
      message: `Не удалось найти указанное значение ${valueType}, установлено значение на ${ValueType.SINGLE}`,
      newValue: ValueType.SINGLE,
    };
  }

  public setAxis(axis: Axis): ModelResponse<string> {
    if (axis === 'X' || axis === 'Y') {
      this.axis = axis;

      this.eventObserver.broadcast({ type: CustomEvents.AXIS_CHANGED, data: { axis: this.axis } });

      return {
        response: Response.SUCCESS,
        message: `Тип отображения установлен на ${axis}`,
        newValue: axis,
      };
    }

    this.axis = 'X';

    this.eventObserver.broadcast({ type: CustomEvents.AXIS_CHANGED, data: { axis: this.axis } });

    return {
      response: Response.ERROR,
      message: `Не удалось найти тип отображения ${axis}, установлено значение X`,
      newValue: 'X',
    };
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
    const optionsList: object = this.getOptionList();

    return optionsList[targetOption];
  }

  public getState(): ModelState {
    return { ...this.state };
  }

  public requestToSetMinAvailableValue(value: number): ModelResponse<number> {
    if (value <= this.maxAvailableValue) {
      this.setMinAvailableValue(value);

      return {
        response: Response.SUCCESS,
        message: `Минимальное значение установлено на ${value}`,
        newValue: value,
      };
    }

    this.setMinAvailableValue(this.minAvailableValue);

    return {
      response: Response.ERROR,
      message: 'Невалидное значение. Минимальное значение не может быть больше чем максимальное.',
      newValue: 0,
    };
  }

  public requestToSetMaxAvailableValue(value: number): ModelResponse<number> {
    if (value >= this.minAvailableValue) {
      this.setMaxAvailableValue(value);

      return {
        response: Response.SUCCESS,
        message: `Максимальное значение установлено на ${value}`,
        newValue: value,
      };
    }

    this.setMaxAvailableValue(this.maxAvailableValue);


    return {
      response: Response.ERROR,
      message: 'Невалидное значение. Максимальное значение не может быть меньше чем минимальное.',
      newValue: 100,
    };
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

  public changeStateByItemName(name: HandlerName, value: number): void {
    this.setState({ name, value });

    if (Object.keys(this.state).length > 1) {
      this.checkCollision(name);
    }

    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public setState({ name, value }: UnconvertedStateItem): void {
    const has = Object.prototype.hasOwnProperty;

    if (has.call(this.state, name)) {
      this.state[name] = value;
    }

    if (Object.keys(this.state).length > 1) {
      this.checkCollision(name);
    }

    this.state[name] = this.findTheClosestBreakpoint(value);
    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public clearState(): void {
    this.state = {};
  }

  public refreshState(): void {
    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public setStepSize(newStepSize: number): ModelResponse<number> {
    const convertedNewStepSize = Math.abs(newStepSize);
    const convertedMaxValue = Math.abs(this.maxAvailableValue);

    if (convertedNewStepSize <= convertedMaxValue && convertedNewStepSize > 0) {
      this.stepSize = Number(convertedNewStepSize);

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: CustomEvents.STEP_SIZE_CHANGED, data: { newBreakpoints: this.breakpoints } });

      return {
        response: Response.SUCCESS,
        message: `Размер шага установлен на ${convertedNewStepSize}`,
        newValue: convertedNewStepSize,
      };
    }
    return {
      response: Response.ERROR,
      message: `Размер шага должен быть от 1 до ${convertedMaxValue}`,
    };
  }

  private setMinAvailableValue(value: number): void {
    this.minAvailableValue = value;
    this.updateBreakpointList();
    this.refreshState();

    this.eventObserver.broadcast({ type: CustomEvents.MIN_AVAILABLE_VALUE_CHANGED, data: { minAvailableValue: this.minAvailableValue } });
  }

  private setMaxAvailableValue(value: number): void {
    this.maxAvailableValue = value;

    this.updateBreakpointList();
    this.refreshState();

    this.eventObserver.broadcast({ type: CustomEvents.MAX_AVAILABLE_VALUE_CHANGED, data: { maxAvailableValue: this.maxAvailableValue } });
  }

  private getOptionList(): AvailableOptions {
    return {
      axis: this.axis,
      valueType: this.valueType,
      minAvailableValue: this.minAvailableValue,
      maxAvailableValue: this.maxAvailableValue,
      minCurrentValue: this.state.minValue ?? 'Значение не найдено',
      maxCurrentValue: this.state.maxValue ?? 'Значение не найдено',
      stepSize: this.stepSize,
      breakpoints: this.breakpoints,
      withTooltip: this.withTooltip,
      withLabels: this.withLabels,
    } as AvailableOptions;
  }

  private callInitialMethods(options: AvailableOptions) {
    this.requestToSetMinAvailableValue(options.minAvailableValue);
    this.requestToSetMaxAvailableValue(options.maxAvailableValue);
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

  private checkCollision(currentStateItem): void {
    const {
      minValue,
      maxValue,
    } = this.state;

    if (currentStateItem === 'minValue') {
      this.state.maxValue = minValue > maxValue
        ? minValue
        : maxValue;
    }

    if (currentStateItem === 'maxValue') {
      this.state.minValue = maxValue < minValue
        ? maxValue
        : minValue;
    }
  }

  private findTheClosestBreakpoint(target) {
    return Math.min(...this.breakpoints.filter((breakpoint) => breakpoint >= target));
  }
}

export default Model;
