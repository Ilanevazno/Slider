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
    type sliderBreakpoint = {
      currentPercent: number;
      pixelPosition: number;
    }
    this.removeBreakpoints();
    const mainHtmlParams: number = this.getSliderBodyParams();
    const direction = this.axis === 'X' ? 'left' : 'top';

    console.log(typeof breakpoints[0]['currentPercent'])

    const minPercent: sliderBreakpoint = breakpoints[0]['currentPercent'];
    const maxPercent = breakpoints[breakpoints.length - 1]['currentPercent'];
    const partOfTheMaxPercent = maxPercent / 10;
    let stepCounter = 0;
    const shortBreakpoints: any = [];

    while (stepCounter <= maxPercent) {
      const shortBreakpointsArray = breakpoints.map((breakpoint) => {
        return stepCounter === breakpoint['currentPercent'] ? breakpoint : null;
      }).filter((breakpoint) => breakpoint != null);

      if (shortBreakpointsArray.length > 0) {
        shortBreakpoints.push(shortBreakpointsArray[0]);
      }

      stepCounter = stepCounter + partOfTheMaxPercent;
    }

    breakpoints = shortBreakpoints;

    this.$breakpoints = breakpoints.map((breakpoint) => {
      console.log(breakpoint)
      const icon = breakpoint['currentPercent'];
      return $('<div/>', {
        class: `slider__breakpoint slider__breakpoint_direction_${direction}`
      })
        .css(direction, `${breakpoint['pixelPosition']}px`)
        .text(icon)
        .appendTo(this.$mainHtml)
        .on('click', this.handleBreakpointClick.bind(this, breakpoint['pixelPosition']));
    });
  }

  private handleBreakpointClick(breakpointPercent): void {
    this.eventObserver.broadcast({ type: 'CHANGE_STATE_BY_CLICK', caughtCoords: breakpointPercent });
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
      this.eventObserver.broadcast({ type: 'CHANGE_STATE_BY_CLICK', caughtCoords });
    }

  }

  private bindActions(): void {
    $(window).on('resize.windowResize', this.handleWindowResize.bind(this));
    this.$mainHtml.on('click', this.handleSliderBodyClick.bind(this));
  }
}

export default SliderBodyView;