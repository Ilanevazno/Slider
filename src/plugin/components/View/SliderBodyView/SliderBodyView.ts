import { SliderBreakpoint, Axis } from '../../types/types';
import CustomEvents from '../../Observer/CustomEvents';
import Observer from '../../Observer/Observer';

class SliderBodyView {
  public $mainHtml: JQuery<HTMLElement>;

  public eventObserver: Observer;

  private breakpointElements: JQuery<HTMLElement>[];

  constructor($htmlContainer: JQuery<HTMLElement>, private axis: Axis) {
    this.eventObserver = new Observer();
    this.axis = axis;
    this.$mainHtml = this.drawSliderBody($htmlContainer);
    this.breakpointElements = [];

    useAutoBind(this);
    this.bindActions();
  }

  public setAxis(axis: Axis): Axis {
    this.axis = axis;
    return this.axis;
  }

  public removeSliderBody(): void {
    this.$mainHtml.remove();
  }

  public getSliderBodyParams(): number {
    return this.axis as unknown as string === 'X'
      ? this.$mainHtml[0].getBoundingClientRect().width
      : this.$mainHtml[0].getBoundingClientRect().height;
  }

  public drawBreakPoints(breakpoints: SliderBreakpoint[]): void {
    this.removeBreakpoints();

    const direction: string = this.axis as unknown as string === 'X' ? 'left' : 'top';
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
          .appendTo(this.$mainHtml)
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
    this.eventObserver.broadcast({ type: CustomEvents.ChangeStateByClick, percentValue: breakpointValue });
  }

  private drawSliderBody($htmlContainer): JQuery<HTMLElement> {
    const sliderBody: JQuery<HTMLElement> = $('<div/>', {
      class: this.axis as unknown as string === 'X'
        ? 'slider__body slider__body_type_horizontal'
        : 'slider__body slider__body_type_vertical',
    }).appendTo($htmlContainer);

    return sliderBody;
  }

  private handleWindowResize(): void {
    this.eventObserver.broadcast({ type: CustomEvents.WindowResize });
  }

  private handleSliderBodyClick(event): void {
    const htmlEventTarget = event.target;
    const caughtCoords: number = this.axis as unknown as string === 'X'
      ? event.offsetX
      : event.offsetY;

    if (htmlEventTarget === this.$mainHtml[0]) {
      this.eventObserver.broadcast({ type: CustomEvents.ChangeStateByClick, caughtCoords });
    }
  }

  private bindActions(): void {
    $(window).on('resize.windowResize', this.handleWindowResize);
    this.$mainHtml.on('click.mainHtmlClick', this.handleSliderBodyClick);
  }
}

export default SliderBodyView;
