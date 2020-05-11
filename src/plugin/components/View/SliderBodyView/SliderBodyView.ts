import Observer from '../../Observer/Observer';

class SliderBodyView {
  public $mainHtml: JQuery<HTMLElement>;
  private axis: string;
  private $breakpoints: any[];
  private eventObserver: Observer;

  constructor($htmlContainer: JQuery<HTMLElement>, axis) {
    this.eventObserver = new Observer();
    this.axis = axis;
    this.$mainHtml = this.drawSliderBody($htmlContainer);
    this.$breakpoints = [];

    this.bindActions();
    this.listenEvents();
  }

  private listenEvents(): void {
    this.eventObserver.subscribe((event) => {
      switch (event.type) {
        case 'SET_BREAKPOINTS_ACTIVITY':
          if (event.isActiveBreakpoints) {
            this.drawBreakPoints(event.breakpoints)
          } else {
            this.removeBreakpoints()
          }
          break
        default:
          break
      }
    });
  }

  public setAxis(axis: string): string {
    return this.axis = axis;
  }

  public removeSliderBody() {
    this.$mainHtml.remove();
  }

  public getSliderBodyParams(): number {
    return this.axis === 'X' ?
      this.$mainHtml[0].offsetWidth
      :
      this.$mainHtml[0].offsetHeight
  }

  public drawBreakPoints(breakpoints: number[]): void {
    this.removeBreakpoints();
    const direction = this.axis === 'X' ? 'left' : 'top';
    const icon = this.axis === 'X' ? '|' : '-';
    console.log(breakpoints);
    this.$breakpoints = breakpoints.map((breakpoint) => {
      return $('<div/>', {
        class: `slider__breakpoint slider__breakpoint_direction_${direction}`
      })
        .css(direction, `${breakpoint}px`)
        .text(icon)
        .appendTo(this.$mainHtml);
    });
  }

  public removeBreakpoints(): void {
    this.$breakpoints.forEach($element => {
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

  private handleWindowResize(): void {
    this.eventObserver.broadcast({ type: 'WINDOW_RESIZE' });
  }

  private handleSliderBodyClick(e): void {
    const caughtTarget = e.target;
    const caughtCoords = this.axis === 'X' ?
      e.offsetX
      :
      e.offsetY;

    if (caughtTarget === this.$mainHtml[0]) {
      this.eventObserver.broadcast({ type: 'SLIDER_BODY_CLICK', caughtCoords });
    }

  }

  private bindActions(): void {
    $(window).on('resize.windowResize', this.handleWindowResize.bind(this));
    this.$mainHtml.on('click', this.handleSliderBodyClick.bind(this));
  }
}

export default SliderBodyView;