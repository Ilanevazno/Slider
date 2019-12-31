export class Model{
    Coords: any;
    activePercent: number;
    enabledLogs: boolean = false;
    activeViewType: string;
    pointerClass: string = "slider__pointer";
    valueClass: string = "slider__value";
    valueFrom: number = 0
    valueTo: number = 0;
    exampl: any = null;

    constructor (observer: any) {
        console.log(observer)
        // this.observer.subscribe(data => {
        //     console.log(data)
        // })
        // this.observer.broadcast({
        //     'sliderWidth': 'this.slider'
        // });

        // console.log(this.observer)
    }
    public getPointerCount (sliderType) {
        let pointersCount = null;
        sliderType === 'singleValue' ? pointersCount = 1 : null;
        sliderType === 'doubleValue' ? pointersCount = 2 : null;

        return pointersCount
    }
    public getPointerState () {
        for (let i = 0; i < $(`.${this.pointerClass}`).length; i++) {
            
        }
    }

    public getPointerValues (sliderType) {
        let valuesArr: any = [];
        if (sliderType == 'doubleValue') {
            for (let i = 0; i < $(`.${this.pointerClass}`).length; i++) {
                let currentValue = $(`.${this.pointerClass}`)[i].style.left.replace('px', '');
                valuesArr.push(currentValue);
            }
        }

        return valuesArr = valuesArr.map((itm, idx) => {
            return {
                pointerName: `pointer_${idx + 1}`,
                pointerValue: Number(itm)
            }
        })
    }

    public changePointerState () {
        for (let i = 0; i < $(`.${this.pointerClass}`).length; i++) {
            let currentValue = $(`.${this.pointerClass}`)[i].style.left.replace('px', '');
            $(`.${this.valueClass}`).eq(i).text(currentValue);
        }
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