export class Model{
    private activePercent: number;
    private sliderBodyClass: string = "slider__body";
    private pointerClass: string = "slider__pointer";
    private valueClass: string = "slider__value";
    private valueFrom: number = 0
    private valueTo: number = 100;
    private pointerStepSize: number = 1;
    private state: any;
    private observer: any;
    private sliderBody: any;

    constructor (observer: any) {
        this.observer = observer;
    }

    public getPointerCount (sliderType) {
        let pointersCount = null;
        sliderType === 'singleValue' ? pointersCount = 1 : null;
        sliderType === 'doubleValue' ? pointersCount = 2 : null;

        return pointersCount
    }

    public setStepSize (stepSize) {
        this.pointerStepSize = stepSize;
    }

    public initState (SliderViewType, sliderWidth) {
        let valuesArr: any = [];
        for (let i = 0; i < $(`.${this.pointerClass}`).length; i++) {
            let currentValue: any;

            switch (SliderViewType) {
                case "vertical":
                    currentValue = Number($(`.${this.pointerClass}`)[i].style.top.replace('px', ''));
                    break
                case "horizontal":
                    currentValue = Number($(`.${this.pointerClass}`)[i].style.left.replace('px', ''));
                    break
            }
            let convertedPerc = this.getValuePercent(sliderWidth, currentValue);
            valuesArr.push([convertedPerc, $(`.${this.pointerClass}`)[i]]);
        }

        return this.state = valuesArr.map((cv, idx) => {
            return {
                pointerName: `pointer_${idx + 1}`,
                pointerValue: cv[0],
                pointerItem: cv[1]
            }
        })
    }

    public getState () {
        return this.state;
    }

    public setState (targetPointer, val) {
        this.state.map(item => {
            targetPointer == item.pointerItem ? item.pointerValue = Number(val) : false;
        })

        for (let i = 0; i < this.state.length; i++) {
            const everyPointers = this.state[i];
            const lastPointer = this.state[this.state.length - 1];
            
            // checking to do collision
            if (targetPointer !==  lastPointer.pointerItem) {
                everyPointers.pointerValue >= lastPointer.pointerValue ? lastPointer.pointerValue = everyPointers.pointerValue : false;
            }

            lastPointer.pointerValue < everyPointers.pointerValue ? everyPointers.pointerValue = lastPointer.pointerValue : false;

            // checking each pointer to min and max values
            everyPointers.pointerValue <= this.valueFrom ? everyPointers.pointerValue = this.valueFrom : false;
            everyPointers.pointerValue >= this.valueTo ? everyPointers.pointerValue = this.valueTo : false;

            //set each pointer statement value
            $(`.${this.valueClass}`).eq(i).text(this.state[i].pointerValue);
        }
        this.observer.broadcast({somedata: this.state})
    }

    public checkCollision (values) {
        const minValue: number = values[0].pointerValue;
        const maxValue: number = values[Object.keys(values).length - 1].pointerValue;
        return minValue >= maxValue ? true : false
    }

    public getShiftВirection (viewType, event, element) {
        let shift = null;
        if (viewType === 'horizontal') {
            shift = event.clientX - $(element)[0].getBoundingClientRect().left;
        } else if (viewType === 'vertical') {
            shift = event.clientY - $(element)[0].getBoundingClientRect().top;;
        }

        return shift
    }

    public getSliderParams (sliderBody, sliderViewType) {
        let sliderPointer = sliderBody.children().eq(0)[0];
        let sliderData = null;
        
        if (sliderViewType === 'horizontal') {
            sliderData = sliderBody[0].offsetWidth - sliderPointer.offsetWidth
        } else if (sliderViewType === 'vertical'){
            sliderData = sliderBody[0].offsetHeight - sliderPointer.offsetHeight;
        }
        return sliderData
    }

    public getPointerPosition (sliderViewType, shift, target) {
        let sliderBody = $(`.${this.sliderBodyClass}`)[0];

        if (sliderViewType === 'horizontal') {
            let position: number = target.clientX - shift - sliderBody.getBoundingClientRect().left;
            return position
        } else if (sliderViewType === 'vertical') {
            let position: number = target.clientY - shift - sliderBody.getBoundingClientRect().top;
            return position
        }
    }

    public checkStepSettings (cursorPosition) {
        return cursorPosition % this.pointerStepSize === 0 ? true : false;
    }

    public getCoords (elem: JQuery<HTMLElement>){
        let box = elem[0].getBoundingClientRect();
        return {
            left: box.left + pageXOffset
        }
    }

    public checkSliderArea (pointerPosition, sliderWidth) {
        pointerPosition < 0 ? pointerPosition = 0 : false;
        pointerPosition > sliderWidth ? pointerPosition = sliderWidth : false;

        return pointerPosition
    }

    private getNthPointer (eq: number) {
        return $(`.${this.pointerClass}`).eq(eq);
    }

    public getValuePercent (sliderWidth: number, percentages: number) {
        return this.activePercent = Math.round(100 * percentages / sliderWidth);
    }

    public PercentToPx (sliderWidth: number, pointerValue: number) {
        return Math.round(sliderWidth / 100 * pointerValue)
    }


}