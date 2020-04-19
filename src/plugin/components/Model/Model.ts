class Model {
  public state: object;
  public axis: string;
  public minValue: number;
  public maxValue: number;
  public valueType: string;

  constructor (options: object) {
    this.state = {};
    this.axis = options['axis'];
    this.valueType = options['valueType'];
    this.minValue = 0;
    this.maxValue = 100;
  }

  public setState (newState): void {
    const copyState = {
      ...this.state,
      ...newState,
    };
    this.state = copyState;
  }

  public getState (): object {
    return this.state;
  }
}

export default Model;
