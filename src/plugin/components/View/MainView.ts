import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';
import CustomEvents from '../Observer/CustomEvents';
import {
  ObserverEvent, StateHandler, SliderBreakpoint, ConvertingData, HandlerEvent, ValueType, Axis,
} from '../types/types';

class MainView {
  public eventObserver: Observer;

  private $sliderContainer: JQuery<HTMLElement>

  public sliderBody: SliderBodyView;

  public minValueHandler: StateHandler;

  public maxValueHandler: StateHandler;

  constructor(private model: Model, initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);

    this.createSliderComponents();
  }

  public refreshView(): void {
    this.sliderBody.removeSliderBody();
    this.eventObserver.broadcast({ type: CustomEvents.ClearState });
    this.createSliderComponents();
    this.eventObserver.broadcast({ type: CustomEvents.RefreshState });
  }

  public setState(handler: string): void {
    const caughtHandlerIndex: number = handler === 'min-value' ? 0 : 1;
    const caughtHandlerInstance: StateHandler = [this.minValueHandler, this.maxValueHandler][caughtHandlerIndex];
    const caughtHandlerName = caughtHandlerInstance.name;
    const $caughtHandlerHtml = caughtHandlerInstance.handler.$html;
    const minValue: number = this.model.getOption('minValue');

    const dataForBroadcasting: ObserverEvent<StateHandler> = {
      type: CustomEvents.SetState,
      data: {
        // $handler: $caughtHandlerHtml,
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
    [this.minValueHandler, this.maxValueHandler].forEach((currentHandler: StateHandler) => {
      if (currentHandler) {
        const tooltipPercent: number = currentHandler.value || this.model.getOption('minValue');
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

  public prepareToMoveHandler(state) {
    [this.minValueHandler, this.maxValueHandler].forEach((handler: StateHandler) => {
      if (handler !== undefined) {
        const findedState = state.filter((currentState) => currentState.name === handler.name);
        if (findedState.length) {
          const currentValue: number = findedState[0].value;
          const htmlContainerWidth: number = this.sliderBody.getSliderBodyParams() - (handler.handler.getHandlerWidth() / 2);
          const optionList: ConvertingData = {
            minPercent: this.model.getOption('minValue'),
            maxPercent: this.model.getOption('maxValue'),
            currentValue,
            htmlContainerWidth,
          };
          const newHandlerPosition: number = this.convertPercentToPixel(optionList);
          const handlerForMoving: StateHandler = handler.name === 'min-value'
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
    const htmlContainerWidth: number = this.sliderBody.getSliderBodyParams();
    const availableBreakpoints: number[] = this.model.getOption('breakpoints');

    return availableBreakpoints.map((currentValue: number) => {
      const optionList: ConvertingData = {
        minPercent: this.model.getOption('minValue'),
        maxPercent: this.model.getOption('maxValue'),
        currentValue,
        htmlContainerWidth,
      };

      return {
        currentValue,
        pixelPosition: this.convertPercentToPixel(optionList),
      };
    });
  }

  private convertPixelToPercent(data: ConvertingData): number {
    const {
      maxPercent,
      minPercent,
      currentValue,
      htmlContainerWidth,
    } = data;
    return (currentValue * (maxPercent - minPercent)) / htmlContainerWidth;
  }

  public convertPercentToPixel(data: ConvertingData): number {
    const {
      minPercent,
      maxPercent,
      currentValue,
      htmlContainerWidth,
    } = data;

    return ((currentValue - minPercent) / (maxPercent - minPercent)) * htmlContainerWidth;
  }

  private convertPxToPercent(currentValue: number): number {
    const optionsForConverting: ConvertingData = {
      minPercent: this.model.getOption('minValue'),
      maxPercent: this.model.getOption('maxValue'),
      htmlContainerWidth: this.sliderBody.getSliderBodyParams(),
      currentValue,
    };
    const minValueOption: number = this.model.getOption('minValue');
    return this.convertPixelToPercent(optionsForConverting) + minValueOption;
  }

  private handleHandlerMove(data: HandlerEvent): number {
    const {
      $handler,
      event,
      name,
      offset,
    } = data;

    const currentPixel: number = this.model.getOption('axis') === 'X'
      ? event.clientX - offset - this.sliderBody.$mainHtml[0].getBoundingClientRect().left
      : event.clientY - offset - this.sliderBody.$mainHtml[0].getBoundingClientRect().top;

    const value: number = this.convertPxToPercent(currentPixel);
    const dataForBroadcasting: ObserverEvent<StateHandler> = {
      type: CustomEvents.SetState,
      data: {
        // $handler,
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
      handler: this.getHandlerComponent(this.sliderBody.$mainHtml),
    };

    const callFunctionAfterAll = (callbackFunction) => setTimeout(callbackFunction, 0);

    this.initHandlerEvents(this.minValueHandler);
    callFunctionAfterAll(() => {
      this.setState('min-value');
    });

    if (valueType as unknown as string === 'double') {
      this.maxValueHandler = {
        name: 'max-value',
        handler: this.getHandlerComponent(this.sliderBody.$mainHtml),
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
        case CustomEvents.WindowResize:
          this.changeBreakpointsActivity();
          this.eventObserver.broadcast({ type: CustomEvents.RefreshState });
          break;
        case CustomEvents.ChangeStateByClick:
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
    const targetPercent: number = this.convertPxToPercent(event.caughtCoords);
    const currentState: StateHandler[] = this.model.getState();
    const availableHandlerValues: number[] = [];

    currentState.forEach((_stateHandler, index) => {
      availableHandlerValues.push(currentState[index].value);
    });

    const findAvailableHandler: number = this.findTheClosestArrayValue(availableHandlerValues, targetPercent);

    currentState.forEach((handler: StateHandler) => {
      if (handler.value === findAvailableHandler) {
        const dataForBroadcasting: ObserverEvent<StateHandler> = {
          type: CustomEvents.SetState,
          data: {
            // $handler: handler.$handler,
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
        case CustomEvents.Mousemove:
          this.handleHandlerMove({
            $handler: parent.handler.$html,
            event: event.data.event,
            name: parent.name,
            offset: event.data.offset,
          });
          break;
        case CustomEvents.Touchmove:
          this.handleHandlerMove({
            $handler: parent.handler.$html,
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
