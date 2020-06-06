import Observer from '../Observer/Observer';
import СustomEvents from '../Observer/CustomEvents';
import { Options, StateHandler, ModelResponse } from '../types/types';
import ModelConstants from './ModelConstants/ModelConstants';

class Model {
  public withLabels: boolean;

  public withTooltip: boolean;

  public axis: string;

  public valueType: string;

  public state: StateHandler[];

  public minValue: number;

  public maxValue: number;

  public stepSize: number;

  public breakPoints: Array<number>;

  public eventObserver: Observer;

  constructor(options: Options) {
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

  public getOption<T>(targetOption: string): T {
    const OptionsList: object = this.getOptionList();


    return OptionsList[targetOption];
  }

  public getState(): StateHandler[] {
    return this.state;
  }

  public setMinValue(value: number): ModelResponse {
    if (value <= this.maxValue) {
      this.minValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: СustomEvents.SetMinValue, data: { minValue: this.minValue } });

      return {
        response: ModelConstants.SuccessResponse,
        message: `Минимальное значение установлено на ${value}`,
      };
    }
    return {
      response: ModelConstants.FailedResponse,
      message: 'Невалидное значения. Минимальное значение не может быть больше чем максимальное.',
    };
  }

  public setMaxValue(value: number): ModelResponse {
    if (value >= this.minValue) {
      this.maxValue = value;

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: СustomEvents.SetMaxValue, data: { maxValue: this.maxValue } });

      return {
        response: ModelConstants.SuccessResponse,
        message: `Максимальное значение установлено на ${value}`,
      };
    }
    return {
      response: ModelConstants.FailedResponse,
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
    this.state.map((stateElement: StateHandler) => {
      if (stateElement.name === handlerName) {
        // eslint-disable-next-line no-param-reassign
        stateElement.value = this.findTheClosestBreakpoint(Number(value));
      }
      return stateElement;
    });

    this.checkCollision(handlerName);

    this.eventObserver.broadcast({ type: СustomEvents.SetState, data: { state: this.state } });
  }

  public setState(currentHandler: StateHandler): void {
    const stateLength = this.getStateLength();

    if (!this.checkIncludeStateValue(currentHandler.$handler)) {
      this.state[stateLength] = currentHandler;
    }

    this.checkCollision(currentHandler.name);

    this.state.map((stateElement: StateHandler) => {
      if (stateElement.$handler[0] === currentHandler.$handler[0]) {
        // eslint-disable-next-line no-param-reassign
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

  public setStepSize(newStepSize: number): ModelResponse {
    const convertedNewStepSize = Math.abs(newStepSize);
    const convertedMaxValue = Math.abs(this.maxValue);

    if (convertedNewStepSize <= convertedMaxValue && convertedNewStepSize > 0) {
      this.stepSize = Number(convertedNewStepSize);

      this.updateBreakpointList();
      this.refreshState();

      this.eventObserver.broadcast({ type: СustomEvents.SetStepSize, data: { newBreakpoints: this.breakPoints } });

      return {
        response: ModelConstants.SuccessResponse,
        message: `Размер шага установлен на ${convertedNewStepSize}`,
      };
    }
    return {
      response: ModelConstants.FailedResponse,
      message: `Размер шага должен быть от 1 до ${convertedMaxValue}`,
    };
  }

  private getOptionList(): Options {
    return {
      axis: this.axis as 'X' | 'Y',
      valueType: this.valueType as 'single' | 'double',
      minValue: this.minValue,
      maxValue: this.maxValue,
      stepSize: this.stepSize,
      breakpoints: this.breakPoints,
      withTooltip: this.withTooltip,
      withLabels: this.withLabels,
    } as Options;
  }

  private checkIncludeStateValue($targetElement: JQuery<HTMLElement>): boolean {
    let isFoundItem = false;

    this.state.map((stateElement: StateHandler) => {
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
