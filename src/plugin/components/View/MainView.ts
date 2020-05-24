import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';
import CustomEvents from '../Observer/CustomEvents';
import {
  observerEvent, stateHandler, sliderBreakpoint, convertingData,
} from '../types/types';

class MainView {
  public eventObserver: Observer;

  private $sliderContainer: JQuery<HTMLElement>

  public sliderBody: SliderBodyView;

  public minValueHandler: stateHandler;

  public maxValueHandler: stateHandler;

  constructor(private model: Model, private initHtmlElement: HTMLElement) {
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
    const caughtHandlerIndex: number = handler === 'min-value' || handler === 'value' ? 0 : 1;
    const caughtHandlerInstance: stateHandler = [this.minValueHandler, this.maxValueHandler][caughtHandlerIndex];
    const caughtHandlerName = caughtHandlerInstance.name;
    const $caughtHandlerHtml = caughtHandlerInstance.handler.$html;
    const minValue: number = this.model.getOption('minValue');

    const dataForBroadcasting: observerEvent<stateHandler> = {
      type: CustomEvents.SetState,
      data: {
        $handler: $caughtHandlerHtml,
        name: caughtHandlerName,
        value: minValue,
      },
    };

    this.eventObserver.broadcast(dataForBroadcasting);
  }

  public changeBreakpointsActivity(): void {
    const isActiveBreakpoints: boolean = this.model.getOption('withLabels');
    const availableBreakpoints: sliderBreakpoint[] = this.getConvertedBreakpoints();

    this.sliderBody.changeBreakpointsActivity(isActiveBreakpoints, availableBreakpoints);
  }

  public setTooltipActivity(isTooltipActive: boolean): void {
    [this.minValueHandler, this.maxValueHandler].map((currentHandler: stateHandler) => {
      if (currentHandler) {
        const tooltipPercent: number = currentHandler.statePercent || this.model.getOption('minValue');
        currentHandler.handler.changeTooltipActivity(isTooltipActive);
        currentHandler.handler.setTooltipValue(tooltipPercent);
      }

      return currentHandler;
    });
  }

  public changeSliderBodyAxis(axis: string): void {
    this.sliderBody.setAxis(axis);
    this.refreshView();

    return this.model.getOption('axis');
  }

  public prepareToMoveHandler(state) {
    state.map((handler: stateHandler) => {
      const $caughtHandler: JQuery<HTMLElement> = $(handler.$handler);
      const currentValue: number = handler.value;
      const htmlContainerWidth: number = this.sliderBody.getSliderBodyParams() - ($caughtHandler[0].offsetWidth / 2);
      const optionList = {
        minPercent: this.model.getOption('minValue'),
        maxPercent: this.model.getOption('maxValue'),
        currentValue,
        htmlContainerWidth,
      };
      const newHandlerPosition: number = this.convertPercentToPixel(optionList);

      const minValueHandlerName = 'min-value';
      const maxValueHandlerName = 'max-value';

      switch (handler.name) {
        case minValueHandlerName:
          this.minValueHandler.handler.moveHandler(newHandlerPosition);
          this.minValueHandler.statePercent = currentValue;

          if (this.withTooltip()) {
            this.minValueHandler.handler.setTooltipValue(currentValue);
          }
          break;
        case maxValueHandlerName:
          this.maxValueHandler.handler.moveHandler(newHandlerPosition);
          this.maxValueHandler.statePercent = currentValue;

          if (this.withTooltip()) {
            this.maxValueHandler.handler.setTooltipValue(currentValue);
          }
          break;
        default:
          break;
      }

      return handler;
    });
  }

  private withTooltip(): boolean {
    return this.model.getOption('withTooltip');
  }

  private getConvertedBreakpoints() {
    const htmlContainerWidth: number = this.sliderBody.getSliderBodyParams();

    return this.model.getOption('breakpoints').map((currentValue: number) => {
      const optionList = {
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

  private convertPixelToPercent(data: convertingData): number {
    const {
      maxPercent,
      minPercent,
      currentValue,
      htmlContainerWidth,
    } = data;
    return Math.trunc((currentValue * (maxPercent - minPercent)) / htmlContainerWidth);
  }

  public convertPercentToPixel(data: convertingData): number {
    const {
      minPercent,
      maxPercent,
      currentValue,
      htmlContainerWidth,
    } = data;

    return Math.trunc(((currentValue - minPercent) / (maxPercent - minPercent)) * htmlContainerWidth);
  }

  private convertPxToPercent(currentValue: number): number {
    const optionsToConvert: convertingData = {
      minPercent: this.model.getOption('minValue'),
      maxPercent: this.model.getOption('maxValue'),
      htmlContainerWidth: this.sliderBody.getSliderBodyParams(),
      currentValue,
    };
    return this.convertPixelToPercent(optionsToConvert) + this.model.getOption('minValue');
  }

  private handleHandlerMove(data: any = { }): number {
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
    const dataForBroadcasting: observerEvent<stateHandler> = {
      type: CustomEvents.SetState,
      data: {
        $handler,
        value,
        name,
      },
    };
    this.eventObserver.broadcast(dataForBroadcasting);

    return value;
  }

  private createSliderComponents() {
    const valueType: string = this.model.getOption('valueType');
    this.sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.minValueHandler = {
      name: 'min-value',
      handler: this.getHandlerComponent(this.sliderBody.$mainHtml),
    };

    this.initHandlerEvents(this.minValueHandler);
    setTimeout(() => {
      this.setState('min-value');
    }, 0);

    if (valueType === 'double') {
      this.maxValueHandler = {
        name: 'max-value',
        handler: this.getHandlerComponent(this.sliderBody.$mainHtml),
      };

      this.initHandlerEvents(this.maxValueHandler);
      setTimeout(() => {
        this.setState('max-value');
      }, 0);
    }

    if (this.model.getOption('withLabels')) {
      this.changeBreakpointsActivity();
    }

    this.initSliderBodyEvents();
  }

  private initSliderBodyEvents(): void {
    this.sliderBody.eventObserver.subscribe((event: observerEvent<any>) => {
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

  private moveHandlerByBodyClick(event): void {
    const targetPercent: number = this.convertPxToPercent(event.caughtCoords);
    const currentState: stateHandler[] = this.model.getState();
    const availableHandlerValues: number[] = [];

    currentState.map((handler, index) => {
      availableHandlerValues.push(currentState[index].value);
      return handler;
    });

    const findTheClosest = (array, base) => {
      let theClosest = Infinity;
      let temp; let
        arrayElement;

      array.map((element, i) => {
        temp = Math.abs(array[i] - base);

        if (temp < theClosest) {
          theClosest = temp;
          arrayElement = array[i];
        }

        return element;
      });

      return arrayElement;
    };

    const findAvailableHandler: number = findTheClosest(availableHandlerValues, targetPercent);

    currentState.map((handler) => {
      if (handler.value === findAvailableHandler) {
        const dataForBroadcasting: observerEvent<stateHandler> = {
          type: CustomEvents.SetState,
          data: {
            $handler: handler.$handler,
            name: handler.name,
            value: targetPercent,
          },
        };
        this.eventObserver.broadcast(dataForBroadcasting);
      }

      return handler;
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
    parent.handler.observer.subscribe((event) => {
      switch (event.type) {
        case CustomEvents.Mousemove:
          this.handleHandlerMove({
            $handler: parent.handler.$html,
            event: event.data.event,
            name: parent.name,
            offset: event.data.handlerClickOffset,
          });
          break;
        case CustomEvents.Touchmove:
          this.handleHandlerMove({
            $handler: parent.handler.$html,
            event: event.data.event.touches[0],
            name: parent.name,
            offset: event.data.handlerClickOffset,
          });
          break;
        default:
          return false;
      }
    });
  }
}

export default MainView;
