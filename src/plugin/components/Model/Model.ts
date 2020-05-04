import Observer from '../Observer/Observer';
import ValidateModel from './ValidateModel/ValidateModel';

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

  constructor(options: object) {
    this.validate = new ValidateModel;
    this.eventObserver = new Observer();
    this.state = {};
    this.isShowLabels = options['showLabels'];
    this.axis = options['axis'] || this.validate.axisX;
    this.valueType = options['valueType'] || this.validate.singleValue;
    this.isEnabledTooltip = options['tooltip'];
    this.minValue = options['minValue'] || 0;
    this.maxValue = options['maxValue'] || 500;
    this.stepSize = this.setStepSize(options['stepSize']);
    this.breakPoints = this.setBreakPointList();
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

  public setBreakPointList(): number[] {
    const stepsBreakpointList: number[] = [];
    let breakPoint: number = 1;

    while (breakPoint <= this.maxValue) {
      stepsBreakpointList.push(breakPoint);
      breakPoint = breakPoint + this.stepSize;
    }

    this.breakPoints = stepsBreakpointList;
    return this.breakPoints;
  }

  private checkIncludeStateValue(targetElement: JQuery<HTMLElement>): boolean {
    let isFoundItem: boolean = false;

    Object.values(this.state).map((stateElement) => {
      if (stateElement.$handler[0] === targetElement[0]) {
        isFoundItem = true;
      }
      return false;
    });

    return isFoundItem;
  }

  private checkCollision (): void {
    let minValue = this.state[0].value;
    let maxValue = this.state[Object.keys(this.state).length - 1].value;

    if (minValue > maxValue) {
      this.state[Object.keys(this.state).length - 1].value = minValue;
    }

    if (maxValue < minValue) {
      this.state[0].value = maxValue
    }
  }

  private isAvailableRange (newState): boolean {
    return newState <= this.maxValue && newState >= this.minValue;
  }

  private calculateNewState (newState): number {
    const nextStep = Math.min(...this.breakPoints.filter((step) => step >= (newState - Math.floor(this.stepSize / 2))));
    return isFinite(nextStep) ? nextStep : this.breakPoints[this.breakPoints.length];
  }

  public setState(newState): void {
    if (!this.checkIncludeStateValue(newState.$handler)) {
      this.state[Object.keys(this.state).length] = newState;
    }
    this.checkCollision();

    Object.values(this.state).map((stateElement) => {
      const isReadyToMoveHandler =
        this.isAvailableRange(newState.value) && stateElement.$handler[0] === newState.$handler[0];
      if (isReadyToMoveHandler) {
        stateElement.value = this.calculateNewState(newState.value);
      }
    });

    this.eventObserver.broadcast({ state: this.state });
  }

  public setStepSize(newStepSize: number | Array<number>): number {
    this.stepSize = Number(newStepSize);

    return this.stepSize;
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
