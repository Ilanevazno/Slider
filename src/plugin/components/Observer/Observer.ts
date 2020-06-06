class Observer {
  private observers: Function[];

  constructor() {
    this.observers = [];
  }

  public subscribe(fn: Function): void {
    this.observers.push(fn);
  }

  public unsubscribe(fn: Function): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  public broadcast(data): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

export default Observer;
