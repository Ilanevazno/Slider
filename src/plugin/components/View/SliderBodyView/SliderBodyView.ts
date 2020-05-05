class SliderBodyView {
  public $mainHtml: JQuery<HTMLElement>;
  private axis: string;
  private breakpoints: any[];

  constructor ($htmlContainer: JQuery<HTMLElement>, axis) {
    this.axis = axis;
    this.$mainHtml = this.drawSliderBody($htmlContainer);
    this.breakpoints = [];
  }

  public setAxis(axis: string): string {
    return this.axis = axis;
  }

  public removeSliderBody() {
    this.$mainHtml.remove();
  }

  public getSliderBodyParams (): number {
    return this.axis === 'X' ?
    this.$mainHtml[0].offsetWidth
    :
    this.$mainHtml[0].offsetHeight
  }

  public drawBreakPoints (breakpoints: number[]): void {
    this.removeBreakpoints();
    const direction = this.axis === 'X' ? 'left' : 'top';
    const icon = this.axis === 'X' ? '|' : '-';
    this.breakpoints = breakpoints.map((breakpoint) => {
      return $('<div/>', {
        class: `slider__breakpoint slider__breakpoint_direction_${direction}`
      })
        .css(direction, `${breakpoint}px`)
        .text(icon)
        .appendTo(this.$mainHtml);
    });
  }

  public removeBreakpoints (): void {
    this.breakpoints.forEach($element => {
      $element.remove();
    });
  }

  private drawSliderBody($htmlContainer): JQuery<HTMLElement> {
    const sliderBody: JQuery<HTMLElement> = $('<div/>', {
      class: this.axis === 'X' ?
      'slider__body slider__body_type_horizontal'
      :
      'slider__body slider__body_type_vertical'
    }).appendTo($htmlContainer);

    return sliderBody;
  }
}

export default SliderBodyView;