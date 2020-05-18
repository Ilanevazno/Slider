class Observer {
  private observers: Array<any>;

  constructor() {
    this.observers = [];
  }

  subscribe(fn): void {
    this.observers.push(fn);
  }

  unsubscribe(fn): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  broadcast(data): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

export default Observer;
