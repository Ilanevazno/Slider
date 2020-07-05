import {
  ObserverEvent,
  ViewHandlerData,
  BodyBreakpointsData,
  CustomEvents,
  HandlerEvent,
  ValueType,
  Axis,
  ModelState,
  HandlerName,
} from '../types/types';
import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';

class MainView {
  public eventObserver: Observer;

  private $sliderContainer: JQuery<HTMLElement>

  public sliderBody: SliderBodyView;

  public minValueHandler: ViewHandlerData;

  public maxValueHandler: ViewHandlerData;

  constructor(private model: Model, initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);

    this.createSliderComponents();
  }

  public refreshView(): void {
    this.sliderBody.remove();
    this.eventObserver.broadcast({ type: CustomEvents.STATE_CLEARED });
    this.createSliderComponents();
    this.eventObserver.broadcast({ type: CustomEvents.STATE_REFRESHED });
  }

  public registerHandlerInState(handler: HandlerName): void {
    const minValue: number = this.model.getOption<number>('minAvailableValue');

    const dataForBroadcasting: ObserverEvent<ViewHandlerData> = {
      type: CustomEvents.STATE_CHANGED,
      data: {
        name: handler,
        value: minValue,
      },
    };

    this.eventObserver.broadcast(dataForBroadcasting);
  }

  public setBreakpointsActivity(): void {
    const isActiveBreakpoints: boolean = this.model.getOption<boolean>('withLabels');
    const data: BodyBreakpointsData = {
      axis: this.model.getOption<Axis>('axis'),
      offsetHandlerWidth: this.minValueHandler.handler.getWidth(),
      currentBreakpointList: this.model.getOption<number[]>('breakpoints'),
      minAvailableValue: this.model.getOption<number>('minAvailableValue'),
      maxAvailableValue: this.model.getOption<number>('maxAvailableValue'),
    };

    this.sliderBody.changeBreakpointsActivity(isActiveBreakpoints, data);
  }

  public setTooltipActivity(isTooltipActive: boolean): void {
    [this.minValueHandler, this.maxValueHandler].forEach((currentHandler: ViewHandlerData) => {
      if (currentHandler) {
        const tooltipPercent: number = currentHandler.value || this.model.getOption<number>('minAvailableValue');
        currentHandler.handler.changeTooltipActivity(isTooltipActive);
        currentHandler.handler.setTooltipValue(tooltipPercent);
      }
    });
  }

  public changeSliderBodyAxis(axis: Axis): string {
    this.sliderBody.setAxis(axis);
    this.refreshView();

    return this.model.getOption<Axis>('axis');
  }

  public moveHandler(dataForMoving: ModelState) {
    [this.minValueHandler, this.maxValueHandler].forEach((currentHandler: ViewHandlerData) => {
      if (currentHandler !== undefined) {
        const foundedHandlerInData = Object.keys(dataForMoving).filter((currentStateItem) => currentStateItem === currentHandler.name);

        if (foundedHandlerInData.length) {
          const currentValue: number = dataForMoving[currentHandler.name];

          currentHandler.handler.move({
            currentValue,
            minPercent: this.model.getOption<number>('minAvailableValue'),
            maxPercent: this.model.getOption<number>('maxAvailableValue'),
            maxValue: this.sliderBody.getSliderBodyParams(),
          });

          // eslint-disable-next-line no-param-reassign
          currentHandler.value = currentValue;

          if (this.withTooltip()) {
            currentHandler.handler.setTooltipValue(currentValue);
          }
        }
      }
    });
  }

  private withTooltip(): boolean {
    return this.model.getOption<boolean>('withTooltip');
  }

  private convertPxToPercent(currentValue: number): number {
    const minPercent: number = this.model.getOption<number>('minAvailableValue');
    const maxPercent: number = this.model.getOption<number>('maxAvailableValue');
    const maxValue: number = this.sliderBody.getSliderBodyParams();
    const minValueOption: number = this.model.getOption<number>('minAvailableValue');

    return (currentValue * (maxPercent - minPercent)) / maxValue + minValueOption;
  }

  private handleHandlerMove(data: HandlerEvent): number {
    const {
      name,
      pos,
    } = data;

    const direction = this.model.getOption<Axis>('axis') === 'X' ? 'left' : 'top';

    const currentPixel: number = pos - this.sliderBody.$sliderBody[0].getBoundingClientRect()[direction];

    const value: number = this.convertPxToPercent(currentPixel);
    const dataForBroadcasting: ObserverEvent<ViewHandlerData> = {
      type: CustomEvents.STATE_CHANGED,
      data: {
        value,
        name,
      },
    };
    this.eventObserver.broadcast(dataForBroadcasting);

    return value;
  }

  private createSliderComponents() {
    const valueType: ValueType = this.model.getOption<ValueType>('valueType');
    this.sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.minValueHandler = {
      name: 'minValue',
      handler: this.getHandlerComponent(this.sliderBody.$sliderBody),
    };

    const callFunctionAfterAll = (callbackFunction) => setTimeout(callbackFunction, 0);

    this.initHandlerEvents(this.minValueHandler);
    this.registerHandlerInState('minValue');

    if (valueType === 'double') {
      this.maxValueHandler = {
        name: 'maxValue',
        handler: this.getHandlerComponent(this.sliderBody.$sliderBody),
      };

      this.initHandlerEvents(this.maxValueHandler);
      this.registerHandlerInState('maxValue');
    }

    if (this.model.getOption<boolean>('withLabels')) {
      callFunctionAfterAll(() => {
        this.setBreakpointsActivity();
      });
    }

    this.initSliderBodyEvents();
  }

  private initSliderBodyEvents(): void {
    this.sliderBody.eventObserver.subscribe((event: ObserverEvent<object>) => {
      switch (event.type) {
        case CustomEvents.WINDOW_RESIZED:
          this.setBreakpointsActivity();
          this.eventObserver.broadcast({ type: CustomEvents.STATE_REFRESHED });
          break;
        case CustomEvents.BODY_CLICKED:
        case CustomEvents.BREAKPOINT_CLICKED:
          this.callToChangeByBreakpointClicked(event);
          break;
        default:
          break;
      }
    });
  }

  private findTheClosestArrayValue(array: number[], base: number): number {
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

  private callToChangeByBreakpointClicked(event): void {
    const availableHandlers = [this.minValueHandler, this.maxValueHandler];
    const targetPercent: number = event.caughtCoords
      ? this.convertPxToPercent(event.caughtCoords)
      : event.percentValue;

    const availableHandlerValues: number[] = [];

    availableHandlers.forEach((current, index) => {
      if (current !== undefined) {
        availableHandlerValues.push(availableHandlers[index].value);
      }
    });

    const findAvailableHandler: number = this.findTheClosestArrayValue(availableHandlerValues, targetPercent);

    availableHandlers.forEach((handler) => {
      if (handler !== undefined && handler.value === findAvailableHandler) {
        const dataForBroadcasting: ObserverEvent<ViewHandlerData> = {
          type: CustomEvents.STATE_CHANGED,
          data: {
            name: handler.name,
            value: targetPercent,
          },
        };
        this.eventObserver.broadcast(dataForBroadcasting);
      }
    });
  }

  private drawSliderContainer(htmlContainer: JQuery<HTMLElement> | HTMLElement): JQuery<HTMLElement> {
    this.$sliderContainer = $('<div/>', {
      class: 'slider__container',
    }).appendTo(htmlContainer);

    return this.$sliderContainer;
  }

  private drawSliderBody($HtmlContainer: JQuery<HTMLElement>): SliderBodyView {
    const sliderBody: SliderBodyView = new SliderBodyView($HtmlContainer, this.model.getOption<Axis>('axis'));

    return sliderBody;
  }

  private getHandlerComponent($HtmlContainer): HandlerView {
    const handler = new HandlerView($HtmlContainer, this.model.getOption<Axis>('axis'));

    const withTooltip: boolean = this.model.getOption<boolean>('withTooltip');

    if (withTooltip) {
      handler.getTooltip();
    }

    return handler;
  }

  private initHandlerEvents(parent): void {
    parent.handler.observer.subscribe((event: ObserverEvent<HandlerEvent>) => {
      switch (event.type) {
        case CustomEvents.HANDLER_MOUSEMOVE:
        case CustomEvents.HANDLER_TOUCHMOVE:
          this.handleHandlerMove({
            pos: this.model.getOption<Axis>('axis') === 'X' ? event.data.posX : event.data.posY,
            name: parent.name,
          });
          break;
        default:
          return false;
      }
    });
  }
}

export default MainView;
