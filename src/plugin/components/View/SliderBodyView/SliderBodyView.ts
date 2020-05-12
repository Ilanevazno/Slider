import Observer from '../../Observer/Observer';
import ViewTypes from '../types/ViewTypes'

class SliderBodyView {
  public $mainHtml: JQuery<HTMLElement>;
  private breakpointElements: Array<JQuery<HTMLElement>>;
  private eventObserver: Observer;

  constructor($htmlContainer: JQuery<HTMLElement>, private axis: string) {
    this.eventObserver = new Observer();
    this.axis = axis;
    this.$mainHtml = this.drawSliderBody($htmlContainer);
    this.breakpointElements = [];

    useAutoBind(this);
    this.bindActions();
    this.listenEvents();
  }

  // public setAxis(_axis: string): any {
    // return this.axis = axis;
  // }

  public removeSliderBody(): void {
    this.$mainHtml.remove();
  }

  public getSliderBodyParams(): number {
    return this.axis === 'X' ?
      this.$mainHtml[0].offsetWidth
      :
      this.$mainHtml[0].offsetHeight
  }

  public drawBreakPoints(breakpoints: ViewTypes.sliderBreakpoint[]): void {
    this.removeBreakpoints();
    const direction: string = this.axis === 'X' ? 'left' : 'top';
    const maxPercent: number = breakpoints[breakpoints.length - 1].currentPercent;
    const partOfTheMaxPercent: number = maxPercent / 10;
    let stepCounter: number = 0;
    const shortBreakpoints: ViewTypes.sliderBreakpoint[] = [];

    while (stepCounter <= maxPercent) {
      const shortBreakpointsArray = breakpoints.map((breakpoint: ViewTypes.sliderBreakpoint) => {
        return stepCounter === breakpoint.currentPercent ? breakpoint : null;
      }).filter((breakpoint) => breakpoint != null);

      if (shortBreakpointsArray.length > 0) {
        shortBreakpoints.push(shortBreakpointsArray[0] as ViewTypes.sliderBreakpoint);
      }

      stepCounter = stepCounter + partOfTheMaxPercent;
    }

    this.breakpointElements = shortBreakpoints.map((breakpoint: ViewTypes.sliderBreakpoint) => {
      const icon: number = breakpoint.currentPercent;

      return $('<div/>', {
        class: `slider__breakpoint slider__breakpoint_direction_${direction}`
      })
        .css(direction, `${breakpoint.pixelPosition}px`)
        .text(icon)
        .appendTo(this.$mainHtml)
        .on('click', this.handleBreakpointClick.bind(null, breakpoint.pixelPosition));
    });
  }

  public removeBreakpoints(): void {
    this.breakpointElements.forEach(($element: JQuery<HTMLElement>) => {
      $element.remove();
    });
  }

  private listenEvents(): void {
    this.eventObserver.subscribe((event) => {
      switch (event.type) {
        case 'SET_BREAKPOINTS_ACTIVITY':
          if (event.isActiveBreakpoints) {
            this.drawBreakPoints(event.breakpoints);
          } else {
            this.removeBreakpoints();
          }
          break;
        default:
          break;
      }
    });
  }

  private handleBreakpointClick(breakpointPixelPosition: number): void {
    this.eventObserver.broadcast({ type: 'CHANGE_STATE_BY_CLICK', caughtCoords: breakpointPixelPosition });
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
    const htmlEventTarget = e.target;
    const caughtCoords: number = this.axis === 'X' ?
      e.offsetX
      :
      e.offsetY;

    if (htmlEventTarget === this.$mainHtml[0]) {
      this.eventObserver.broadcast({ type: 'CHANGE_STATE_BY_CLICK', caughtCoords });
    }
  }

  private bindActions(): void {
    $(window).on('resize.windowResize', this.handleWindowResize);
    this.$mainHtml.on('click.mainHtmlClick', this.handleSliderBodyClick);
  }
}

export default SliderBodyView;