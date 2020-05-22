import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import ValidateView from './ValidateView/ValidateView';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';
import TooltipView from './TooltipView/TooltipView';
import CustomEvents from '../Observer/CustomEvents';
import {
  handlerInstance, observerEvent, stateHandler, breakpointsData,
} from '../types/types';

class MainView {
  public eventObserver: Observer;

  private $sliderContainer: JQuery<HTMLElement>

  private validateView: ValidateView;

  public sliderBody: SliderBodyView;

  public handlerMinValue: handlerInstance;

  public handlerMaxValue: handlerInstance;

  constructor(public model: Model, private initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.validateView = new ValidateView();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);

    this.drawSliderInstances();
  }

  public refreshView(): void {
    this.sliderBody.removeSliderBody();
    this.eventObserver.broadcast({ type: CustomEvents.ClearState });
    this.drawSliderInstances();
    this.eventObserver.broadcast({ type: CustomEvents.RefreshState });
  }

  public setState(handler: string): void {
    const caughtHandlerIndex: number = handler === 'min-value' || handler === 'value' ? 0 : 1;
    const caughtHandlerInstance: handlerInstance = [this.handlerMinValue, this.handlerMaxValue][caughtHandlerIndex];
    const caughtHandlerName = caughtHandlerInstance.name;
    const $caughtHandlerHtml = caughtHandlerInstance.instances.handler.$html;
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
    const availableBreakpoints: number[] = this.getConvertedBreakpoints();
    const isActiveBreakpoints: boolean = this.model.getOption('isShowLabels');
    const broadcastingData: observerEvent<breakpointsData> = {
      type: CustomEvents.SetBreakpointsActivity,
      data: {
        isActiveBreakpoints,
        breakpoints: isActiveBreakpoints ? availableBreakpoints : null,
      },
    };

    this.sliderBody.eventObserver.broadcast(broadcastingData);
  }

  public setTooltipActivity(isTooltipActive: boolean): void {
    [this.handlerMinValue, this.handlerMaxValue].map((currentHandler: handlerInstance) => {
      if (currentHandler) {
        const tooltipPercent: number = currentHandler.statePercent || this.model.getOption('minValue');
        currentHandler.instances.tooltip.eventObserver.broadcast({ type: CustomEvents.SetTooltipActivity, data: { isTooltipActive } });
        currentHandler.instances.tooltip.eventObserver.broadcast({ type: CustomEvents.SetTooltipValue, data: tooltipPercent });
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
      const newHandlerPosition: number = this.validateView.convertPercentToPixel(optionList);

      const valueType: string = this.model.getOption('valueType');

      const minValueHandlerName: string = valueType === 'single' ? 'min-value' : 'min-value';
      const maxValueHandlerName = 'max-value';

      switch (handler.name) {
        case minValueHandlerName:
          this.handlerMinValue.instances.handler.moveHandler(newHandlerPosition);
          this.handlerMinValue.statePercent = currentValue;

          if (this.isEnabledTooltip()) {
            this.handlerMinValue.instances.tooltip.eventObserver.broadcast({ type: CustomEvents.SetTooltipValue, data: currentValue });
          }
          break;
        case maxValueHandlerName:
          this.handlerMaxValue.instances.handler.moveHandler(newHandlerPosition);
          this.handlerMaxValue.statePercent = currentValue;

          if (this.isEnabledTooltip()) {
            this.handlerMaxValue.instances.tooltip.eventObserver.broadcast({ type: CustomEvents.SetTooltipValue, data: currentValue });
          }
          break;
        default:
          break;
      }

      return handler;
    });
  }

  private isEnabledTooltip(): boolean {
    return this.model.getOption('isEnabledTooltip');
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
        pixelPosition: this.validateView.convertPercentToPixel(optionList),
      };
    });
  }

  private setPointerShift(newShift: number): void {
    this.validateView.setHandlerShift(newShift);
  }

  private handleHandlerMouseDown(event) {
    event.preventDefault();
    const $caughtHandler: JQuery<HTMLElement> = $(event.target);
    const shift: number = event.clientX - $caughtHandler[0].getBoundingClientRect().left;
    this.setPointerShift(shift);
  }

  private convertPxToPercent(currentValue: number): number {
    const optionsToConvert = {
      minPercent: this.model.getOption('minValue'),
      maxPercent: this.model.getOption('maxValue'),
      htmlContainerWidth: this.sliderBody.getSliderBodyParams(),
      currentValue,
    };
    return this.validateView.convertPixelToPercent(optionsToConvert) + this.model.getOption('minValue');
  }

  private handleHandlerMove({ $handler, event, name }): number {
    const shift: number = this.validateView.getHandlerShift();
    const currentPixel: number = this.model.getOption('axis') === 'X'
      ? event.clientX - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().left
      : event.clientY - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().top;

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

  private drawSliderInstances() {
    const valueType: string = this.model.getOption('valueType');
    this.sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.handlerMinValue = {
      name: valueType === 'single' ? 'min-value' : 'min-value',
      instances: this.drawHandlerInstances(this.sliderBody.$mainHtml),
    };

    this.initHandlerEvents(this.handlerMinValue);
    setTimeout(() => {
      this.setState('min-value');
    }, 0);

    if (valueType === 'double') {
      this.handlerMaxValue = {
        name: 'max-value',
        instances: this.drawHandlerInstances(this.sliderBody.$mainHtml),
      };

      this.initHandlerEvents(this.handlerMaxValue);
      setTimeout(() => {
        this.setState('max-value');
      }, 0);
    }

    if (this.model.getOption('isShowLabels')) {
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

  private drawHandlerInstances($HtmlContainer): object {
    const sliderHandler = new HandlerView($HtmlContainer, this.model.getOption('axis'));
    const handlerTooltip: TooltipView = new TooltipView(sliderHandler.$html, this.model.getOption('axis'));

    const isTooltipActive: boolean = this.model.getOption('isEnabledTooltip');

    if (isTooltipActive) {
      handlerTooltip.eventObserver.broadcast({ type: CustomEvents.SetTooltipActivity, data: { isTooltipActive } });
    }

    return {
      handler: sliderHandler,
      tooltip: handlerTooltip,
    };
  }

  private initHandlerEvents(parent): void {
    parent.instances.handler.observer.subscribe((event) => {
      switch (event.type) {
        case CustomEvents.Mousedown:
          this.handleHandlerMouseDown(event.data);
          break;
        case CustomEvents.Mousemove:
          this.handleHandlerMove({
            $handler: parent.instances.handler.$html,
            event: event.data,
            name: parent.name,
          });
          break;
        case CustomEvents.Touchmove:
          this.handleHandlerMove({
            $handler: parent.instances.handler.$html,
            event: event.data.touches[0],
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
