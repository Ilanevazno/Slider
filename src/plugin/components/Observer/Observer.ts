// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ObserverInterface {
  export class Observer {
    observers: any;

    constructor() {
      this.observers = [];
    }

    public subscribe(fn: any): void {
      this.observers.push(fn);
    }

    public unsubscribe(fn: any): void {
      this.observers = this.observers.filter(
        (subscriber: any) => subscriber !== fn,
      );
    }

    public broadcast(data: any): void {
      this.observers.forEach((subscriber) => subscriber(data));
    }
  }
}
