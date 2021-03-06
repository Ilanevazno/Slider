import {
  CustomEvents, Axis, BodyBreakpointsData, ObserverEvent, InteractiveComponentEvent, rangeSettings,
} from '../../types/types';
import Observer from '../../Observer/Observer';
import BreakpointsView from '../BreakpointsView/BreakpointsView';
import RangeView from '../RangeView/RangeView';
import MainView from '../MainView';

class SliderBodyView {
  public readonly $sliderBody: JQuery<HTMLElement>;

  public readonly eventObserver: Observer;

  private readonly breakpoints: BreakpointsView;

  private $bodyClickArea: JQuery<HTMLElement>

  private readonly axis: Axis;

  private rangeView: RangeView;

  constructor(private readonly mainView: MainView) {
    this.eventObserver = new Observer();
    this.axis = mainView.model.getOption('axis');
    this.$sliderBody = this.drawBody(mainView.$sliderContainer);
    this.breakpoints = new BreakpointsView(this.axis, this);

    this.listenBreakpointsEvents();

    useAutoBind(this);
    this.bindActions();
  }

  public updateRange(): void {
    if (this.rangeView) {
      this.rangeView.update();
    }
  }

  public getRangeView(): void {
    const settings: rangeSettings = {
      axis: this.mainView.model.getOption('axis'),
      valueType: this.mainView.model.getOption('valueType'),
      handlers: {
        minValue: this.mainView.minValueHandler,
        maxValue: this.mainView.maxValueHandler,
      },
      $parent: this.$sliderBody,
    };
    this.rangeView = new RangeView(settings);
  }

  public remove(): void {
    this.$sliderBody.remove();
  }

  public getSliderBodyParams(): number {
    return this.axis === 'X'
      ? this.$sliderBody.width()
      : this.$sliderBody.height();
  }

  public findTheClosestArrayValue(array: number[], base: number): number {
    let theClosest = Infinity;
    let temp;
    let arrayElement;

    array.map((element, i) => {
      temp = Math.abs(array[i] - base);

      if (temp < theClosest) {
        theClosest = temp;
        arrayElement = array[i];
      }

      return element;
    });

    return arrayElement;
  }

  public changeBreakpointsAvailability(isActive: boolean, breakpointsData: BodyBreakpointsData): void {
    if (isActive) {
      this.breakpoints.draw(breakpointsData);
    } else {
      this.breakpoints.remove();
    }
  }

  private listenBreakpointsEvents() {
    this.breakpoints.eventObserver.subscribe((event: ObserverEvent<InteractiveComponentEvent>) => {
      switch (event.type) {
        case CustomEvents.BREAKPOINT_CLICKED:
          this.eventObserver.broadcast({ type: CustomEvents.BREAKPOINT_CLICKED, data: event.data });
          break;
        default:
          return event;
      }
    });
  }

  private drawBody($htmlContainer: JQuery<HTMLElement>): JQuery<HTMLElement> {
    const sliderBody: JQuery<HTMLElement> = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__body slider__body_type_horizontal'
        : 'slider__body slider__body_type_vertical',
    }).appendTo($htmlContainer);

    this.$bodyClickArea = $('<div/>', {
      class: 'slider__click-area',
    }).css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: '1000',
    }).appendTo(sliderBody);

    return sliderBody;
  }

  private handleWindowResize(): void {
    this.eventObserver.broadcast({ type: CustomEvents.WINDOW_RESIZED });
  }

  public getRangeValues(): number[] {
    return [
      this.mainView.minValueHandler.handler.value,
      this.mainView.maxValueHandler
        ? this.mainView.maxValueHandler.handler.value
        : this.mainView.minValueHandler.handler.value,
    ];
  }

  private convertPxToPercent(currentValue: number): number {
    const minPercent: number = this.mainView.model.getOption<number>('minAvailableValue');
    const maxPercent: number = this.mainView.model.getOption<number>('maxAvailableValue');
    const maxValue: number = this.getSliderBodyParams();
    const minValueOption: number = this.mainView.model.getOption<number>('minAvailableValue');

    return (currentValue * (maxPercent - minPercent)) / maxValue + minValueOption;
  }

  private handleSliderBodyClick(event: JQuery.Event): void {
    const caughtCoords: number = this.axis === 'X'
      ? event.offsetX
      : event.offsetY;

    const availableHandlerValues = this.getRangeValues();
    const newValue = this.convertPxToPercent(caughtCoords);
    const oldValue: number = this.findTheClosestArrayValue(availableHandlerValues, newValue);

    const data = { oldValue, newValue };

    this.eventObserver.broadcast({ type: CustomEvents.BODY_CLICKED, data });
  }

  private bindActions(): void {
    $(window).on('resize.windowResize', this.handleWindowResize);
    this.$bodyClickArea.on('click.bodyClickAreaClick', this.handleSliderBodyClick);
  }
}

export default SliderBodyView;
