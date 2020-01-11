export namespace GettingPointer {
    export class Pointer {
        pointerList: any = []
        constructor () {
        }

        public generatePointer (body, className = 'Pointer', count = 1) {
        for(let i = 0; i < count; i++) {
            const sliderPointer = $('<span/>', {
                class: className
            }).appendTo(body);

            this.pointerList.push({sliderPointer});
        }
        return this.pointerList;
        }

        public setOffset (viewType): void {
            // the method sets for each new pointer an offset by the width of the pointer
            let renderShiftCounter: number = 0;
            for (let i = 0; i < this.pointerList.length; i++) {
                if (viewType === 'horizontal') {
                    $(this.pointerList)[i].sliderPointer.css({
                        "left": `${renderShiftCounter}px`
                    })} else if (viewType === 'vertical') {
                        $(this.pointerList)[i].sliderPointer.css({
                        "top": `${renderShiftCounter}px`
                    })
                }

                renderShiftCounter = renderShiftCounter + $(this.pointerList)[i].sliderPointer.width();
            }
        }

        public destroyPointers () {
            for (let i = 0; i < this.pointerList.length; i++) {
                $(this.pointerList)[i].sliderPointer.remove();
            }
        }
    }
}
