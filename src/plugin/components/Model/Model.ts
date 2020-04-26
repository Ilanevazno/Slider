class Model {
  public state: object;
  public axis: string;
  public sliderType: string;
  public minValue: number;
  public maxValue: number;
  public valueType: string;
  public stepSize: number;
  public isEnabledTooltip: boolean;
  public breakPoints: Array<number>;

  constructor(options: object) {
    this.state = {};
    this.axis = options['axis'];
    this.valueType = options['valueType'];
    this.sliderType = options['sliderType'];
    this.isEnabledTooltip = options['tooltip'] || false;
    this.minValue = options['minValue'] || 0;
    this.maxValue = options['maxValue'] || 100;
    this.breakPoints = [];
    this.stepSize = this.setStepSize(options['stepSize']);
  }

  private getOptionList() {
    const optionList = {
      axis: this.axis,
      valueType: this.valueType,
      minValue: this.minValue,
      maxValue: this.maxValue,
      stepSize: this.stepSize,
    }

    return optionList;
  }

  private checkBreakpoints(newState): boolean {
    let isReadyToChange: boolean = false;

    const stepsBreakpointList: number[] = [];
    let breakPoint: number = this.minValue;

    while (breakPoint <= this.maxValue) {
      stepsBreakpointList.push(breakPoint);
      breakPoint = breakPoint + this.stepSize;
    }

    stepsBreakpointList.map((breakPoint): boolean => {
      if (newState.value === breakPoint) {
        isReadyToChange = true;
      }

      return newState;
    })

    return isReadyToChange;
  }

  public setState(newState): void {
    const checkIncludes = (targetElement: JQuery<HTMLElement>): boolean => {
      let isFoundItem: boolean = false;

      Object.values(this.state).map((stateElement) => {
        if (stateElement.$handler[0] === targetElement[0]) {
          isFoundItem = true;
        }
        return false;
      });

      return isFoundItem;
    }

    if (this.checkBreakpoints(newState)) {
      if (!checkIncludes(newState.$handler)) {
        this.state[Object.keys(this.state).length + 1] = newState;
      }

      let minValue = this.state[1].value;
      let maxValue = this.state[Object.keys(this.state).length].value;

      if (minValue > maxValue) {
        this.state[Object.keys(this.state).length].value = minValue;
      }

      if (maxValue < minValue) {
        this.state[1].value = maxValue
      }

      Object.values(this.state).map((stateElement) => {
        if (stateElement.$handler[0] === newState.$handler[0]) {
          stateElement.value = newState.value;
        }
      });
    }
  }

  public setStepSize(newStepSize: number | Array<number>): number {
    this.stepSize = Number(newStepSize);

    const breakPoints: Array<number> = [];
    let breakPoint: number = this.minValue;

    while (breakPoint < this.maxValue) {
      breakPoint = breakPoint + Number(newStepSize);
      breakPoints.push(Number(breakPoint));
    }

    this.breakPoints = breakPoints;

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
