class Observer {
  private observers: Array<Function>;

  constructor() {
    this.observers = [];
  }

  public subscribe(fn): void {
    this.observers.push(fn);
  }

  public unsubscribe(fn): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  public broadcast(data): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

export default Observer;
