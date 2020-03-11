// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PointerIndicator {
  export class Indicator {
    activeIndicators: any = [];

    getIndicator(data: any, className: string) {
      for (let i = 0; i < data.length; i += 1) {
        const valueIndicator = $('<span/>', {
          class: className,
          text: data[i].pointerValue,
        }).appendTo($(data)[i].pointerItem);

        this.activeIndicators.push(valueIndicator);
      }
    }

    removeIndicator() {
      for (let i = 0; i < this.activeIndicators.length; i += 1) {
        $(this.activeIndicators)[i].remove();
      }
      this.activeIndicators = [];
    }
  }
}
