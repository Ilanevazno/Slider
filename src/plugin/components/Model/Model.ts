import {
  availableOptions,
  modelState,
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

  public state: modelState[];

  public minValue: number;

  public maxValue: number;

  public stepSize: number;

  public breakPoints: number[];

  public eventObserver: Observer;

  constructor(options: availableOptions) {
    this.eventObserver = new Observer();
    this.state = [];
    this.withLabels = options.withLabels;
    this.axis = options.axis;
    this.valueType = options.valueType;
    this.withTooltip = options.withTooltip;
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
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

  public showTooltip(): void {
    this.withTooltip = true;

    this.eventObserver.broadcast({ type: CustomEvents.TOOLTIP_ACTIVITY_CHANGED, data: { withTooltip: this.withTooltip } });
  }

  public hideTooltip(): void {
    this.withTooltip = false;

    this.eventObserver.broadcast({ type: CustomEvents.TOOLTIP_ACTIVITY_CHANGED, data: { withTooltip: this.withTooltip } });
  }

  public getOption<T>(targetOption: string): T {
    const OptionsList: object = this.getOptionList();


    return OptionsList[targetOption];
  }

  public getState(): modelState[] {
    return this.state;
  }

  public setMinValue(value: number): ModelResponse {
    if (value <= this.maxValue) {
      this.minValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: CustomEvents.MIN_VALUE_CHANGED, data: { minValue: this.minValue } });

      return {
        response: Response.SuccessResponse,
        message: `Минимальное значение установлено на ${value}`,
      };
    }
    return {
      response: Response.FailedResponse,
      message: 'Невалидное значение. Минимальное значение не может быть больше чем максимальное.',
    };
  }

  public setMaxValue(value: number): ModelResponse {
    if (value >= this.minValue) {
      this.maxValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: CustomEvents.MAX_VALUE_CHANGED, data: { maxValue: this.maxValue } });

      return {
        response: Response.SuccessResponse,
        message: `Максимальное значение установлено на ${value}`,
      };
    }
    return {
      response: Response.FailedResponse,
      message: 'Невалидное значение. Максимальное значение не может быть меньше чем минимальное.',
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
    this.state = this.state.map((stateElement: modelState) => {
      if (stateElement.name === handlerName) {
        return {
          ...stateElement,
          value: this.findTheClosestBreakpoint(Number(value)),
        };
      }
      return stateElement;
    });

    this.checkCollision(handlerName);

    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public setState(currentHandler: modelState): void {
    const stateLength = this.getStateLength();

    if (!this.checkIncludeStateValue(currentHandler.name)) {
      this.state[stateLength] = currentHandler;
    }

    this.checkCollision(currentHandler.name);

    this.state = this.state.map((stateElement: modelState) => {
      if (stateElement.name === currentHandler.name) {
        return {
          ...stateElement,
          value: this.findTheClosestBreakpoint(currentHandler.value)
        };
      }

      return stateElement;
    });

    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public clearState(): void {
    this.state = [];
  }

  public refreshState(): void {
    this.state.forEach((item) => {
      this.setState(item);
    });

    this.eventObserver.broadcast({ type: CustomEvents.STATE_CHANGED, data: { state: this.state } });
  }

  public setStepSize(newStepSize: number): ModelResponse {
    const convertedNewStepSize = Math.abs(newStepSize);
    const convertedMaxValue = Math.abs(this.maxValue);

    if (convertedNewStepSize <= convertedMaxValue && convertedNewStepSize > 0) {
      this.stepSize = Number(convertedNewStepSize);

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: CustomEvents.STEP_SIZE_CHANGED, data: { newBreakpoints: this.breakPoints } });

      return {
        response: Response.SuccessResponse,
        message: `Размер шага установлен на ${convertedNewStepSize}`,
      };
    }
    return {
      response: Response.FailedResponse,
      message: `Размер шага должен быть от 1 до ${convertedMaxValue}`,
    };
  }

  private getOptionList(): availableOptions {
    return {
      axis: this.axis,
      valueType: this.valueType,
      minValue: this.minValue,
      maxValue: this.maxValue,
      stepSize: this.stepSize,
      breakpoints: this.breakPoints,
      withTooltip: this.withTooltip,
      withLabels: this.withLabels,
    } as availableOptions;
  }

  private checkIncludeStateValue(targetElement: string): boolean {
    let isFoundItem = false;

    this.state.map((stateElement: modelState) => {
      if (stateElement.name === targetElement) {
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
      this.state[stateLength - 1].value = minValue > maxValue
        ? this.state[0].value
        : this.state[stateLength - 1].value;
    }

    if (currentHandler === 'max-value') {
      this.state[0].value = maxValue < minValue
        ? this.state[stateLength - 1].value
        : this.state[0].value;
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
