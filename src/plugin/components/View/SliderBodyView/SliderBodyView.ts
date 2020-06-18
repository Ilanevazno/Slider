import { SliderBreakpoint, CustomEvents, Axis } from '../../types/types';
import Observer from '../../Observer/Observer';

class SliderBodyView {
  public $sliderBody: JQuery<HTMLElement>;

  public eventObserver: Observer;

  private breakpointElements: JQuery<HTMLElement>[];

  constructor($htmlContainer: JQuery<HTMLElement>, private axis: Axis) {
    this.eventObserver = new Observer();
    this.axis = axis;
    this.$sliderBody = this.drawBody($htmlContainer);
    this.breakpointElements = [];

    useAutoBind(this);
    this.bindActions();
  }

  public setAxis(axis: Axis): Axis {
    this.axis = axis;
    return this.axis;
  }

  public remove(): void {
    this.$sliderBody.remove();
  }

  public getSliderBodyParams(): number {
    return this.axis === 'X'
      ? this.$sliderBody[0].getBoundingClientRect().width
      : this.$sliderBody[0].getBoundingClientRect().height;
  }

  public drawBreakPoints(breakpoints: SliderBreakpoint[]): void {
    this.removeBreakpoints();

    const direction: string = this.axis === 'X' ? 'left' : 'top';
    let shortStepCounter: number = Math.trunc((breakpoints.length - 1) / 10);
    const shortBreakpoints: SliderBreakpoint[] = [];
    shortBreakpoints.push(breakpoints[0]);

    while (shortStepCounter <= breakpoints.length) {
      shortBreakpoints.push(breakpoints[shortStepCounter]);

      const cycleCounter = Math.trunc(breakpoints.length / 10) === 0
        ? Math.ceil(breakpoints.length / 10)
        : Math.trunc(breakpoints.length / 10);

      shortStepCounter += cycleCounter;
    }

    this.breakpointElements = shortBreakpoints
      .filter((breakpoint) => breakpoint !== undefined).map((breakpoint: SliderBreakpoint) => {
        const icon: number = breakpoint.currentValue;

        return $('<div/>', {
          class: `slider__breakpoint slider__breakpoint_direction_${direction}`,
        })
          .css(direction, `${breakpoint.pixelPosition}px`)
          .text(icon)
          .appendTo(this.$sliderBody)
          .on('click', this.handleBreakpointClick.bind(null, icon));
      });
  }

  public removeBreakpoints(): void {
    this.breakpointElements.forEach(($element: JQuery<HTMLElement>) => {
      $element.remove();
    });
  }

  public changeBreakpointsActivity(isActive: boolean, availableBreakpoints: SliderBreakpoint[]): void {
    if (isActive) {
      this.drawBreakPoints(availableBreakpoints);
    } else {
      this.removeBreakpoints();
    }
  }

  private handleBreakpointClick(breakpointValue: number): void {
    this.eventObserver.broadcast({ type: CustomEvents.BREAKPOINT_CLICKED, percentValue: breakpointValue });
  }

  private drawBody($htmlContainer): JQuery<HTMLElement> {
    const sliderBody: JQuery<HTMLElement> = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__body slider__body_type_horizontal'
        : 'slider__body slider__body_type_vertical',
    }).appendTo($htmlContainer);

    return sliderBody;
  }

  private handleWindowResize(): void {
    this.eventObserver.broadcast({ type: CustomEvents.WINDOW_RESIZED });
  }

  private handleSliderBodyClick(event): void {
    const htmlEventTarget = event.target;
    const caughtCoords: number = this.axis === 'X'
      ? event.offsetX
      : event.offsetY;

    if (htmlEventTarget === this.$sliderBody[0]) {
      this.eventObserver.broadcast({ type: CustomEvents.BODY_CLICKED, caughtCoords });
    }
  }

  private bindActions(): void {
    $(window).on('resize.windowResize', this.handleWindowResize);
    this.$sliderBody.on('click.sliderBodyClick', this.handleSliderBodyClick);
  }
}

export default SliderBodyView;
