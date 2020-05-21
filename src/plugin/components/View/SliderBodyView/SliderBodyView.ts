/* eslint-disable @typescript-eslint/unbound-method */
import Observer from '../../Observer/Observer';
import { sliderBreakpoint } from '../../types/types';
import * as customEvent from '../../Observer/customEvents';

class SliderBodyView {
  public $mainHtml: JQuery<HTMLElement>;

  public eventObserver: Observer;

  private breakpointElements: JQuery<HTMLElement>[];

  constructor($htmlContainer: JQuery<HTMLElement>, private axis: string) {
    this.eventObserver = new Observer();
    this.axis = axis;
    this.$mainHtml = this.drawSliderBody($htmlContainer);
    this.breakpointElements = [];

    useAutoBind(this);
    this.bindActions();
    this.listenEvents();
  }

  public setAxis(axis: string): string {
    this.axis = axis;
    return this.axis;
  }

  public removeSliderBody(): void {
    this.$mainHtml.remove();
  }

  public getSliderBodyParams(): number {
    return this.axis === 'X'
      ? this.$mainHtml[0].offsetWidth
      : this.$mainHtml[0].offsetHeight;
  }

  public drawBreakPoints(breakpoints: sliderBreakpoint[]): void {
    this.removeBreakpoints();

    const direction: string = this.axis === 'X' ? 'left' : 'top';
    let shortStepCounter: number = Math.trunc((breakpoints.length - 1) / 10);
    const shortBreakpoints: sliderBreakpoint[] = [];
    shortBreakpoints.push(breakpoints[0]);

    while (shortStepCounter <= breakpoints.length) {
      shortBreakpoints.push(breakpoints[shortStepCounter]);

      shortStepCounter += Math.trunc(breakpoints.length / 10);
    }

    this.breakpointElements = shortBreakpoints
      .filter((breakpoint) => breakpoint !== undefined).map((breakpoint: sliderBreakpoint) => {
        const icon: number = breakpoint.currentPercent;

        return $('<div/>', {
          class: `slider__breakpoint slider__breakpoint_direction_${direction}`,
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
        case customEvent.setBreakpointsActivity:
          if (event.data.isActiveBreakpoints) {
            this.drawBreakPoints(event.data.breakpoints);
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
    this.eventObserver.broadcast({ type: customEvent.changeStateByClick, caughtCoords: breakpointPixelPosition });
  }

  private drawSliderBody($htmlContainer): JQuery<HTMLElement> {
    const sliderBody: JQuery<HTMLElement> = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__body slider__body_type_horizontal'
        : 'slider__body slider__body_type_vertical',
    }).appendTo($htmlContainer);

    return sliderBody;
  }

  private handleWindowResize(): void {
    this.eventObserver.broadcast({ type: customEvent.windowResize });
  }

  private handleSliderBodyClick(event): void {
    const htmlEventTarget = event.target;
    const caughtCoords: number = this.axis === 'X'
      ? event.offsetX
      : event.offsetY;

    if (htmlEventTarget === this.$mainHtml[0]) {
      this.eventObserver.broadcast({ type: customEvent.changeStateByClick, caughtCoords });
    }
  }

  private bindActions(): void {
    $(window).on('resize.windowResize', this.handleWindowResize);
    this.$mainHtml.on('click.mainHtmlClick', this.handleSliderBodyClick);
  }
}

export default SliderBodyView;
