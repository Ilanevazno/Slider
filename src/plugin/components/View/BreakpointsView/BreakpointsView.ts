import {
  SliderBreakpoint, Axis, CustomEvents, BodyBreakpointsData,
} from '../../types/types';
import Observer from '../../Observer/Observer';
import SliderBodyView from '../SliderBodyView/SliderBodyView';

class BreakpointsView {
  public eventObserver: Observer;

  private breakpointElements: JQuery<HTMLElement>[];

  constructor(private axis: Axis, private parent: SliderBodyView) {
    this.eventObserver = new Observer();
    this.breakpointElements = [];

    useAutoBind(this);
  }

  public draw(breakpointsData: BodyBreakpointsData): void {
    this.remove();

    const breakpoints = this.getConvertedBreakpoints(breakpointsData);

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
          .appendTo(this.parent.$sliderBody)
          .on('click', this.handleBreakpointClick.bind(null, icon));
      });

    if (this.axis === 'X') {
      this.breakpointElements.forEach((item: JQuery<HTMLElement>) => {
        const oldItemPosition = Number(item.css('left').replace('px', ''));
        const itemOffset: number = oldItemPosition - (item.width() / 5);
        item.css('left', itemOffset);
      });
    }
  }

  public remove() {
    this.breakpointElements.forEach(($element: JQuery<HTMLElement>) => {
      $element.remove();
    });
  }

  private getConvertedBreakpoints(data: BodyBreakpointsData) {
    const {
      axis,
      offsetHandlerWidth,
      currentBreakpointList,
      minAvailableValue,
      maxAvailableValue,
    } = data;
    const axisDivisionOffset = axis === 'X' ? 4 : 2;
    const sliderBodyParams: number = this.parent.getSliderBodyParams() - offsetHandlerWidth;

    return currentBreakpointList.map((currentValue: number) => {
      const currentPixel = ((currentValue - minAvailableValue) / (maxAvailableValue - minAvailableValue)) * sliderBodyParams;

      return {
        currentValue,
        pixelPosition: currentPixel + (offsetHandlerWidth / axisDivisionOffset),
      };
    });
  }

  private handleBreakpointClick(breakpointValue: number): void {
    const availableHandlerValues = this.parent.getRangeValues();

    const value: number = this.parent.findTheClosestArrayValue(availableHandlerValues, breakpointValue);

    this.eventObserver.broadcast({ type: CustomEvents.BREAKPOINT_CLICKED, data: { oldValue: value, newValue: breakpointValue } });
  }
}

export default BreakpointsView;
