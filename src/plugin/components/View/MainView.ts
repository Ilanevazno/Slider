import {
  ObserverEvent,
  ViewHandlerData,
  SliderBreakpoint,
  ConvertingData,
  CustomEvents,
  HandlerEvent,
  ValueType,
  Axis,
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
    console.log(this.minValueHandler);
  }

  public refreshView(): void {
    this.sliderBody.remove();
    this.eventObserver.broadcast({ type: CustomEvents.STATE_CLEARED });
    this.createSliderComponents();
    this.eventObserver.broadcast({ type: CustomEvents.STATE_REFRESHED });
  }

  public setState(handler: string): void {
    const caughtHandlerIndex: number = handler === 'min-value' ? 0 : 1;
    const caughtHandlerInstance: ViewHandlerData = [this.minValueHandler, this.maxValueHandler][caughtHandlerIndex];
    const caughtHandlerName = caughtHandlerInstance.name;
    const minValue: number = this.model.getOption('minAvailableValue');

    const dataForBroadcasting: ObserverEvent<ViewHandlerData> = {
      type: CustomEvents.STATE_CHANGED,
      data: {
        name: caughtHandlerName,
        value: minValue,
      },
    };

    this.eventObserver.broadcast(dataForBroadcasting);
  }

  public changeBreakpointsActivity(): void {
    const isActiveBreakpoints: boolean = this.model.getOption('withLabels');
    const availableBreakpoints: SliderBreakpoint[] = this.getConvertedBreakpoints();

    this.sliderBody.changeBreakpointsActivity(isActiveBreakpoints, availableBreakpoints);
  }

  public setTooltipActivity(isTooltipActive: boolean): void {
    [this.minValueHandler, this.maxValueHandler].forEach((currentHandler: ViewHandlerData) => {
      if (currentHandler) {
        const tooltipPercent: number = currentHandler.value || this.model.getOption('minAvailableValue');
        currentHandler.handler.changeTooltipActivity(isTooltipActive);
        currentHandler.handler.setTooltipValue(tooltipPercent);
      }
    });
  }

  public changeSliderBodyAxis(axis: Axis): void {
    this.sliderBody.setAxis(axis);
    this.refreshView();

    return this.model.getOption('axis');
  }

  public prepareToMoveHandler(dataForMoving) {
    [this.minValueHandler, this.maxValueHandler].forEach((handler: ViewHandlerData) => {
      if (handler !== undefined) {
        const foundedHandlerInData = Object.keys(dataForMoving).filter((currentStateItem) => currentStateItem === handler.name);

        if (foundedHandlerInData.length) {
          const currentValue: any = dataForMoving[handler.name].value;
          const maxValue: number = this.sliderBody.getSliderBodyParams() - handler.handler.getHandlerWidth();
          const optionList: ConvertingData = {
            minPercent: this.model.getOption('minAvailableValue'),
            maxPercent: this.model.getOption('maxAvailableValue'),
            currentValue,
            maxValue,
          };
          const newHandlerPosition: number = this.convertPercentToPixel(optionList);
          const handlerForMoving: ViewHandlerData = handler.name === 'min-value'
            ? this.minValueHandler
            : this.maxValueHandler;

          handlerForMoving.handler.moveHandler(newHandlerPosition);
          handlerForMoving.value = currentValue;

          if (this.withTooltip()) {
            handlerForMoving.handler.setTooltipValue(currentValue);
          }
        }
      }
    });
  }

  private withTooltip(): boolean {
    return this.model.getOption('withTooltip');
  }

  private getConvertedBreakpoints() {
    const axisDivisionOffset = this.model.getOption('axis') === 'X' ? 4 : 2;
    const offsetHandlerWidth = this.minValueHandler.handler.getHandlerWidth();
    const sliderBodyParams: number = this.sliderBody.getSliderBodyParams() - offsetHandlerWidth;
    const availableBreakpoints: number[] = this.model.getOption('breakpoints');

    return availableBreakpoints.map((currentValue: number) => {
      const optionList: ConvertingData = {
        minPercent: this.model.getOption('minAvailableValue'),
        maxPercent: this.model.getOption('maxAvailableValue'),
        maxValue: sliderBodyParams,
        currentValue,
      };

      return {
        currentValue,
        pixelPosition: this.convertPercentToPixel(optionList) + (offsetHandlerWidth / axisDivisionOffset),
      };
    });
  }

  private convertPixelToPercent(data: ConvertingData): number {
    const {
      maxPercent,
      minPercent,
      currentValue,
      maxValue,
    } = data;
    return (currentValue * (maxPercent - minPercent)) / maxValue;
  }

  public convertPercentToPixel(data: ConvertingData): number {
    const {
      minPercent,
      maxPercent,
      currentValue,
      maxValue,
    } = data;

    return ((currentValue - minPercent) / (maxPercent - minPercent)) * maxValue;
  }

  private convertPxToPercent(currentValue: number): number {
    const optionsForConverting: ConvertingData = {
      minPercent: this.model.getOption('minAvailableValue'),
      maxPercent: this.model.getOption('maxAvailableValue'),
      maxValue: this.sliderBody.getSliderBodyParams(),
      currentValue,
    };
    const minValueOption: number = this.model.getOption('minAvailableValue');
    return this.convertPixelToPercent(optionsForConverting) + minValueOption;
  }

  private handleHandlerMove(data: HandlerEvent): number {
    const {
      event,
      name,
      offset,
    } = data;

    const currentPixel: number = this.model.getOption('axis') === 'X'
      ? event.clientX - offset - this.sliderBody.$sliderBody[0].getBoundingClientRect().left
      : event.clientY - offset - this.sliderBody.$sliderBody[0].getBoundingClientRect().top;

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
    const valueType: ValueType = this.model.getOption('valueType');
    this.sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.minValueHandler = {
      name: 'min-value',
      handler: this.getHandlerComponent(this.sliderBody.$sliderBody),
    };

    const callFunctionAfterAll = (callbackFunction) => setTimeout(callbackFunction, 0);

    this.initHandlerEvents(this.minValueHandler);
    callFunctionAfterAll(() => {
      this.setState('min-value');
    });

    if (valueType === 'double') {
      this.maxValueHandler = {
        name: 'max-value',
        handler: this.getHandlerComponent(this.sliderBody.$sliderBody),
      };

      this.initHandlerEvents(this.maxValueHandler);
      callFunctionAfterAll(() => {
        this.setState('max-value');
      });
    }

    if (this.model.getOption('withLabels')) {
      callFunctionAfterAll(() => {
        this.changeBreakpointsActivity();
      });
    }

    this.initSliderBodyEvents();
  }

  private initSliderBodyEvents(): void {
    this.sliderBody.eventObserver.subscribe((event: ObserverEvent<object>) => {
      switch (event.type) {
        case CustomEvents.WINDOW_RESIZED:
          this.changeBreakpointsActivity();
          this.eventObserver.broadcast({ type: CustomEvents.STATE_REFRESHED });
          break;
        case CustomEvents.BODY_CLICKED:
        case CustomEvents.BREAKPOINT_CLICKED:
          this.moveHandlerByBodyClick(event);
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

  private moveHandlerByBodyClick(event): void {
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
    const sliderBody: SliderBodyView = new SliderBodyView($HtmlContainer, this.model.getOption('axis'));

    return sliderBody;
  }

  private getHandlerComponent($HtmlContainer): HandlerView {
    const handler = new HandlerView($HtmlContainer, this.model.getOption('axis'));

    const isTooltipActive: boolean = this.model.getOption('withTooltip');

    if (isTooltipActive) {
      handler.getTooltip();
    }

    return handler;
  }

  private initHandlerEvents(parent): void {
    parent.handler.observer.subscribe((event: ObserverEvent<HandlerEvent>) => {
      switch (event.type) {
        case CustomEvents.HANDLER_MOUSEMOVE:
          this.handleHandlerMove({
            $handler: parent.handler.$handler,
            event: event.data.event,
            name: parent.name,
            offset: event.data.offset,
          });
          break;
        case CustomEvents.HANDLER_TOUCHMOVE:
          this.handleHandlerMove({
            $handler: parent.handler.$handler,
            event: event.data.event.touches[0],
            name: parent.name,
            offset: event.data.offset,
          });
          break;
        default:
          return false;
      }
    });
  }
}

export default MainView;
