export class Model{
    Coords: any;
    activePercent: number;
    enabledLogs: boolean = false;
    activeViewType: string;
    observers: any = [];
    pointerClass: string = "slider__pointer";
    valueClass: string = "slider__value";
    valueFrom: number = 0
    valueTo: number = 0;

    constructor () {
        this.observers = [];
    }

    public getPointerState () {
        for (let i = 0; i < $(`.${this.pointerClass}`).length; i++) {
            
        }
    }

    public changePointerState () {
        console.log(this.observers);
        for (let i = 0; i < $(`.${this.pointerClass}`).length; i++) {
            let currentValue = $(`.${this.pointerClass}`)[i].style.left.replace('px', '');
            $(`.${this.valueClass}`).eq(i).text(currentValue);
        }
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