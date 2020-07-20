class Observer {
  private observers: Function[];

  constructor() {
    this.observers = [];
  }

  public subscribe(fn: Function): void {
    this.observers.push(fn);
  }

  public broadcast(data): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

export default Observer;
