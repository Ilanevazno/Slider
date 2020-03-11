// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SliderBody {
  export class Body {
    body: any;

    renderSliderBody(viewType, className, exemplar) {
      if (viewType === 'horizontal') {
        const slider = $('<div/>', {
          class: `${className} slider__body-horizontal`,
        }).prependTo(exemplar);

        this.body = slider;
      } else if (viewType === 'vertical') {
        const slider = $('<div/>', {
          class: `${className} slider__body-vertical`,
        }).prependTo(exemplar);

        this.body = slider;
      }
    }

    getBody() {
      return this.body;
    }

    destroy() {
      $(this.body).remove();
    }
  }
}
