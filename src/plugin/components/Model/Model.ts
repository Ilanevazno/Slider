class Model {
  public state: object;
  public axis: string;
  public sliderType: string;
  public minValue: number;
  public maxValue: number;
  public valueType: string;
  public stepSize: number;
  public breakPoints: Array<number>;

  constructor(options: object) {
    this.state = {};
    this.axis = options['axis'];
    this.valueType = options['valueType'];
    this.sliderType = options['sliderType'];
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

    stepsBreakpointList.map((breakPoint): boolean => {
      if (newState.value === breakPoint) {
        isReadyToMove = true;
      }

      return newState;
    })

    return isReadyToMove;
  }

  public setState(newState): void {
    if (this.validateNewHandlerState(newState)) {
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


      const elem = newState.$handler[0];

      console.log(Object.values(this.state).find(newState))
      // console.log(Object.values(this.state).find(elem));


      if (!checkIncludes(newState.$handler)) {
        this.state[Object.keys(this.state).length + 1] = newState;
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
