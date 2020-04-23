class Model {
  public state: object;
  public axis: string;
  public minValue: number;
  public maxValue: number;
  public valueType: string;
  public stepSize: number;
  public breakPoints: Array<number>;

  constructor(options: object) {
    this.state = {};
    this.axis = options['axis'];
    this.valueType = options['valueType'];
    this.minValue = 0;
    this.maxValue = 100;
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

  private validateNewHandlerState(newState): boolean {
    let isReadyToMove: boolean = false;

    const stepsBreakpointList: number[] = [];
    let breakPoint: number = this.minValue;

    while (breakPoint <= this.maxValue) {
      stepsBreakpointList.push(breakPoint);
      breakPoint = breakPoint + this.stepSize;
    }

    stepsBreakpointList.map((breakPoint) => {
      if (newState['newHandlerPercent'] === breakPoint) {
        isReadyToMove = true;
      }

      return newState;
    })

    return isReadyToMove;
  }

  public setState(newState): void {
    const copyState = {
      ...this.state,
      ...newState,
    };
    if (this.validateNewHandlerState(newState)) {
      this.state = copyState;
    }
  }

  public setStepSize(newStepSize: number | Array<number>): number{
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
