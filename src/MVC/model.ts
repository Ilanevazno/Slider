export class Model{
    Coords: any;
    activePercent: number;
    enabledLogs: boolean = false;
    activeViewType: string;
    observers: any = [];

    constructor () {
        this.observers = [];
    }

    public subscribe (fn: any) {
        this.observers.push(fn);

    }

    public broadcast (data: any) {
        this.observers.forEach( (subscriber: any) => { subscriber(data)} );
    }

    public getCoords(elem: JQuery<HTMLElement>){
        let box = elem[0].getBoundingClientRect();
        return {
            left: box.left + pageXOffset
        }
    }

    public getValuePercent(sliderWidth: number, percentages: number) {
        return this.activePercent = Math.round(100 * percentages / sliderWidth);
    }

    public devLog(message: any) {
        this.enabledLogs ? console.log(message) : false;
    }

    public enableLogs (state: boolean) {
        this.enabledLogs = state;
    }


}