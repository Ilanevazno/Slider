export class Model{
    constructor() {
    }

    subscribe = (observer: any) => {
        this.getCoords = observer;
    }
    
    getCoords(elem: JQuery<HTMLElement>){
        let box = elem[0].getBoundingClientRect();
        return {
            left: box.left + pageXOffset
        }
    }
}