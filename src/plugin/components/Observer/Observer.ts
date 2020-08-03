class Observer {
  private readonly observers: Function[];

  constructor() {
    this.observers = [];
  }

  public subscribe(fn: Function): void {
    this.observers.push(fn);
  }

  public broadcast(data: object): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

export default Observer;
