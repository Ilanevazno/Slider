namespace ObserverInterface {
    let generateObserver = function (): void{
        let observer = new Observer;
    }
    interface observer {
        generateObserver(): void;
    }
    export class Observer {
        observers: any;
        constructor () {
            this.observers = [];
        }
    
        public subscribe (fn: any): void {
            this.observers.push(fn);
        }
    
        public unsubscribe (fn: any): void {
            this.observers = this.observers.filter(
                (subscriber: any) => { subscriber !== fn }
            )
        }
    
        public broadcast (data: any): void {
            this.observers.forEach ((subscriber: any) => subscriber(data));
        }
    }
}

export default ObserverInterface