// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GettingPointer {
  export class Pointer {
    pointerList: any;

    public generatePointer(body, className = 'Pointer', count = 1) {
      this.pointerList = [];
      for (let i = 0; i < count; i += 1) {
        const sliderPointer = $('<span/>', {
          class: className,
        }).appendTo(body);

        this.pointerList.push({ sliderPointer });
      }
      return this.pointerList;
    }

    public setOffset(viewType): void {
      // the method sets for each new pointer an offset by the width of the pointer
      let renderShiftCounter = 0;
      for (let i = 0; i < this.pointerList.length; i += 1) {
        if (viewType === 'horizontal') {
          $(this.pointerList)[i].sliderPointer.css({
            left: `${renderShiftCounter}px`,
          });
        } else if (viewType === 'vertical') {
          $(this.pointerList)[i].sliderPointer.css({
            top: `${renderShiftCounter}px`,
          });
        }

        renderShiftCounter += $(this.pointerList)[i].sliderPointer.width();
      }
    }

    public getPointerList() {
      return this.pointerList;
    }

    public destroyPointers() {
      for (let i = 0; i < this.pointerList.length; i += 1) {
        $(this.pointerList)[i].sliderPointer.remove();
      }

      this.pointerList = [];

      return this.pointerList;
    }
  }
}
