import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import ValidateView from './ValidateView/ValidateView';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';
import TooltipView from './TooltipView/TooltipView';
import * as customEvent from '../Observer/customEvents';
import {
  handlerInstance, observerEvent, handlerData, breakpointsData,
} from '../types/types';

class MainView {
  public eventObserver: Observer;

  private $sliderContainer: JQuery<HTMLElement>

  private validateView: ValidateView;

  public sliderBody: SliderBodyView;

  public handlerMinValue!: handlerInstance;

  public handlerMaxValue!: handlerInstance;

  constructor(public model: Model, private initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.validateView = new ValidateView();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);
    this.sliderBody = this.drawSliderBody(this.$sliderContainer);

    this.drawSliderInstances();
  }

  public refreshView(): void {
    this.sliderBody.removeSliderBody();
    this.eventObserver.broadcast({ type: customEvent.clearState });
    this.drawSliderInstances();
    this.eventObserver.broadcast({ type: customEvent.refreshState });
  }

  public setState(handler: string): void {
    const caughtHandlerIndex: number = handler === 'min-value' || handler === 'value' ? 0 : 1;
    const caughtHandlerInstance: handlerInstance = [this.handlerMinValue, this.handlerMaxValue][caughtHandlerIndex];
    const caughtHandlerName = caughtHandlerInstance.name;
    const $caughtHandlerHtml = caughtHandlerInstance.instances.handler.$html;
    const minValue: number = this.model.getOption('minValue');

    const dataForBroadcasting: observerEvent<handlerData> = {
      type: customEvent.setState,
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
      type: customEvent.setBreakpointsActivity,
      data: {
        isActiveBreakpoints,
        breakpoints: isActiveBreakpoints ? availableBreakpoints : false,
      },
    };

    this.sliderBody.eventObserver.broadcast(broadcastingData);
  }

  public setTooltipActivity(isTooltipActive: boolean): void {
    [this.handlerMinValue, this.handlerMaxValue].map((currentHandler: handlerInstance) => {
      if (currentHandler) {
        const tooltipPercent: number = currentHandler.statePercent || this.model.getOption('minValue');
        currentHandler.instances.tooltip.eventObserver.broadcast({ type: customEvent.setTooltipActivity, data: { isTooltipActive } });
        currentHandler.instances.tooltip.eventObserver.broadcast({ type: customEvent.setTooltipValue, data: tooltipPercent });
      }

      return currentHandler;
    });
  }

  public changeSliderBodyAxis(axis: string): void {
    this.sliderBody.setAxis(axis);
    this.refreshView();

    return this.model.getOption('axis');
  }

  public prepareToMoveHandler(currentHandler) {
    Object.values(currentHandler).map((handler: any) => {
      const $caughtHandler: JQuery<HTMLElement> = $(handler.$handler);
      const currentPercent: number = handler.value;
      const maxContainerWidth: number = this.sliderBody.getSliderBodyParams() - ($caughtHandler[0].offsetWidth / 2);
      const optionList = {
        minPercent: this.model.getOption('minValue'),
        maxPercent: this.model.getOption('maxValue'),
        currentPercent,
        maxContainerWidth,
      };
      const newHandlerPosition: number = this.validateView.convertPercentToPixel(optionList);

      const valueType: string = this.model.getOption('valueType');

      const minValueHandlerName: string = valueType === 'singleValue' ? 'min-value' : 'min-value';
      const maxValueHandlerName = 'max-value';

      switch (handler.name) {
        case minValueHandlerName:
          this.handlerMinValue.instances.handler.moveHandler(newHandlerPosition);
          this.handlerMinValue.statePercent = currentPercent;

          if (this.isEnabledTooltip()) {
            this.handlerMinValue.instances.tooltip.eventObserver.broadcast({ type: customEvent.setTooltipValue, data: currentPercent });
          }
          break;
        case maxValueHandlerName:
          this.handlerMaxValue.instances.handler.moveHandler(newHandlerPosition);
          this.handlerMaxValue.statePercent = currentPercent;

          if (this.isEnabledTooltip()) {
            this.handlerMaxValue.instances.tooltip.eventObserver.broadcast({ type: customEvent.setTooltipValue, data: currentPercent });
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
    const maxContainerWidth: number = this.sliderBody.getSliderBodyParams();

    return this.model.getOption('breakpoints').map((currentPercent: number) => {
      const optionList = {
        minPercent: this.model.getOption('minValue'),
        maxPercent: this.model.getOption('maxValue'),
        currentPercent,
        maxContainerWidth,
      };

      return {
        currentPercent,
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

  private convertPxToPercent(currentPixel: number): number {
    const optionsToConvert = {
      containerWidth: this.sliderBody.getSliderBodyParams(),
      minPercent: this.model.getOption('minValue'),
      maxPercent: this.model.getOption('maxValue'),
      currentPixel,
    };
    return this.validateView.convertPixelToPercent(optionsToConvert) + this.model.getOption('minValue');
  }

  private handleHandlerMove({ $handler, event, name }): number {
    const shift: number = this.validateView.getHandlerShift();
    const currentPixel: number = this.model.getOption('axis') === 'X'
      ? event.clientX - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().left
      : event.clientY - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().top;

    const value: number = this.convertPxToPercent(currentPixel);
    const dataForBroadcasting: observerEvent<handlerData> = {
      type: customEvent.setState,
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
    // this.sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.handlerMinValue = {
      name: valueType === 'singleValue' ? 'min-value' : 'min-value',
      instances: this.drawHandlerInstances(this.sliderBody.$mainHtml),
    };

    this.initHandlerEvents(this.handlerMinValue);
    setTimeout(() => {
      this.setState('min-value');
    }, 0);

    if (valueType === 'doubleValue') {
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
    this.sliderBody.eventObserver.subscribe((event: observerEvent<never>) => {
      switch (event.type) {
        case customEvent.windowResize:
          this.changeBreakpointsActivity();
          this.eventObserver.broadcast({ type: customEvent.refreshState });
          break;
        case customEvent.changeStateByClick:
          this.moveHandlerByBodyClick(event);
          break;
        default:
          break;
      }
    });
  }

  private moveHandlerByBodyClick(event): void {
    const targetPercent: number = this.convertPxToPercent(event.caughtCoords);
    const currentState: object = this.model.getState();
    const availableHandlerValues: number[] = [];

    Object.values(currentState).map((handler, index) => {
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

    Object.values(currentState).map((handler) => {
      if (handler.value === findAvailableHandler) {
        const dataForBroadcasting: observerEvent<handlerData> = {
          type: customEvent.setState,
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
      handlerTooltip.eventObserver.broadcast({ type: customEvent.setTooltipActivity, data: { isTooltipActive } });
    }

    return {
      handler: sliderHandler,
      tooltip: handlerTooltip,
    };
  }

  private initHandlerEvents(parent): void {
    parent.instances.handler.observer.subscribe((event) => {
      switch (event.type) {
        case customEvent.mousedown:
          this.handleHandlerMouseDown(event.data);
          break;
        case customEvent.mousemove:
          this.handleHandlerMove({
            $handler: parent.instances.handler.$html,
            event: event.data,
            name: parent.name,
          });
          break;
        case customEvent.touchmove:
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
