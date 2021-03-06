import {
  ObserverEvent,
  ViewHandlerData,
  BodyBreakpointsData,
  CustomEvents,
  HandlerEvent,
  ValueType,
  Axis,
  ModelState,
  InteractiveComponentEvent,
} from '../types/types';
import { OptionConnector } from '../Model/Model';
import Observer from '../Observer/Observer';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';

class MainView {
  public readonly eventObserver: Observer;

  public $sliderContainer: JQuery<HTMLElement>

  public sliderBody: SliderBodyView;

  public minValueHandler: ViewHandlerData;

  public maxValueHandler: ViewHandlerData;

  constructor(public readonly model: OptionConnector, private readonly initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);

    this.createSliderComponents();
  }

  public refreshView(): void {
    this.sliderBody.remove();
    this.createSliderComponents();
  }

  public setBreakpointsAvailability(): void {
    const withLabels = this.model.getOption<boolean>('withLabels');
    const data: BodyBreakpointsData = {
      axis: this.model.getOption<Axis>('axis'),
      offsetHandlerWidth: this.minValueHandler.handler.getWidth(),
      currentBreakpointList: this.model.getOption<number[]>('breakpoints'),
      minAvailableValue: this.model.getOption<number>('minAvailableValue'),
      maxAvailableValue: this.model.getOption<number>('maxAvailableValue'),
    };

    this.sliderBody.changeBreakpointsAvailability(withLabels, data);
  }

  public setTooltipAvailability(withTooltip: boolean): void {
    [this.minValueHandler, this.maxValueHandler].forEach((currentHandler: ViewHandlerData) => {
      if (currentHandler) {
        const tooltipValue: number = currentHandler.handler.value;
        currentHandler.handler.setTooltipAvailability(withTooltip);
        currentHandler.handler.setTooltipValue(tooltipValue);
      }
    });
  }

  public moveHandler(dataForMoving: ModelState) {
    [this.minValueHandler, this.maxValueHandler]
      .filter((item) => item !== undefined)
      .forEach(({ name, handler }: ViewHandlerData) => {
        const foundedHandlerInData = Object.keys(dataForMoving).filter((currentStateItem) => currentStateItem === name);

        if (foundedHandlerInData.length) {
          const currentValue: number = dataForMoving[name];

          handler.move({
            currentValue,
            minPercent: this.model.getOption<number>('minAvailableValue'),
            maxPercent: this.model.getOption<number>('maxAvailableValue'),
            maxContainerSize: this.sliderBody.getSliderBodyParams(),
          });

          // eslint-disable-next-line no-param-reassign
          handler.value = currentValue;

          if (this.withTooltip()) {
            handler.setTooltipValue(currentValue);
          }
        }
      });

    this.sliderBody.updateRange();
  }

  private withTooltip(): boolean {
    return this.model.getOption<boolean>('withTooltip');
  }

  private handleHandlerMove(data: HandlerEvent): number {
    const {
      value,
      name,
    } = data;

    const dataForBroadcasting: ObserverEvent<HandlerEvent> = {
      type: CustomEvents.HANDLER_MOUSEMOVE,
      data: {
        value,
        name,
      },
    };
    this.eventObserver.broadcast(dataForBroadcasting);

    return value;
  }

  private createSliderComponents() {
    const valueType = this.model.getOption<ValueType>('valueType');
    this.sliderBody = this.drawSliderBody();
    this.minValueHandler = {
      name: 'minValue',
      handler: this.getHandlerComponent(),
    };

    const callFunctionAfterAll = (callbackFunction: Function) => setTimeout(callbackFunction, 0);

    this.initHandlerEvents(this.minValueHandler);

    if (valueType === 'double') {
      this.maxValueHandler = {
        name: 'maxValue',
        handler: this.getHandlerComponent(),
      };

      this.initHandlerEvents(this.maxValueHandler);
    } else this.maxValueHandler = undefined;

    if (this.model.getOption<boolean>('withLabels')) {
      callFunctionAfterAll(() => {
        this.setBreakpointsAvailability();
      });
    }

    callFunctionAfterAll(() => {
      this.sliderBody.getRangeView();
    });

    this.initSliderBodyEvents();
  }

  private initSliderBodyEvents(): void {
    this.sliderBody.eventObserver.subscribe((event: ObserverEvent<InteractiveComponentEvent>) => {
      switch (event.type) {
        case CustomEvents.WINDOW_RESIZED:
          this.setBreakpointsAvailability();
          this.moveHandler({
            minValue: this.minValueHandler.handler.value,
            maxValue: this.maxValueHandler?.handler.value,
          });
          break;
        case CustomEvents.BODY_CLICKED:
        case CustomEvents.BREAKPOINT_CLICKED:
          this.interactiveComponentClicked(event.data);
          break;
        default:
          break;
      }
    });
  }

  private interactiveComponentClicked({ oldValue, newValue }: InteractiveComponentEvent): void {
    const availableHandlers = [this.minValueHandler, this.maxValueHandler]
      .filter((handler) => handler !== undefined);

    availableHandlers.forEach((handler: ViewHandlerData) => {
      if (handler.handler.value === oldValue) {
        const dataForBroadcasting: ObserverEvent<ViewHandlerData> = {
          type: CustomEvents.INTERACTIVE_COMPONENT_CLICKED,
          data: {
            value: newValue,
            name: handler.name,
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

  private drawSliderBody(): SliderBodyView {
    const sliderBody: SliderBodyView = new SliderBodyView(this);

    return sliderBody;
  }

  private getHandlerComponent(): HandlerView {
    const handler = new HandlerView(this);

    const withTooltip = this.model.getOption<boolean>('withTooltip');

    if (withTooltip) {
      handler.setTooltipAvailability(true);
    }

    return handler;
  }

  private initHandlerEvents(parent: ViewHandlerData): void {
    parent.handler.observer.subscribe((event: ObserverEvent<HandlerEvent>) => {
      switch (event.type) {
        case CustomEvents.HANDLER_MOUSEMOVE:
        case CustomEvents.HANDLER_TOUCHMOVE:
          this.handleHandlerMove({
            name: parent.name,
            value: event.data.value,
          });
          break;
        default:
          return false;
      }
    });
  }
}

export default MainView;
