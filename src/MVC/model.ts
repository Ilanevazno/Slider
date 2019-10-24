export class Model{
    Coords: any;
    activePercent: number;
    getPercent: number;

    getCoords(elem: JQuery<HTMLElement>){
        let box = elem[0].getBoundingClientRect();
        return {
            left: box.left + pageXOffset
        }
    }

    getValueIndicator(sliderWidth: number, percentages: number) {
        return this.activePercent = Math.round(100 * percentages / sliderWidth);
    }

    subscribe(observer: any) {
        this.getPercent = observer;
        console.log(this.getPercent);
    }
}