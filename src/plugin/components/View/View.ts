import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import ValidateView from './ValidateView/ValidateView';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';
import TooltipView from './TooltipView/TooltipView';

class View {
  private $sliderContainer: JQuery<HTMLElement>
  private sliderBody: any;
  private handlerMinValue: any
  private handlerMaxValue: any

  public eventObserver: Observer;
  private validateView: ValidateView;

  constructor(private model: Model, private initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.validateView = new ValidateView();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);
    this.sliderBody = null;
    this.handlerMinValue = null
    this.handlerMaxValue = null

    this.drawSliderInstances();
  }

  public refreshView(): void {
    this.sliderBody.removeSliderBody();
    this.eventObserver.broadcast({ type: 'CLEAR_STATE' });
    this.drawSliderInstances();
    this.eventObserver.broadcast({ type: 'REFRESH_STATE' });
  }

  public setState(handler: string): void {
    const caughtHandlerIndex = handler === 'min-value' || handler === 'value' ? 0 : 1;
    const caughtHandlerInstance = [this.handlerMinValue, this.handlerMaxValue][caughtHandlerIndex];
    const caughtHandlerName = caughtHandlerInstance.name;
    const $caughtHandlerHtml = caughtHandlerInstance.instances.handler.$html;
    const minValue = this.model.getOption('minValue');

    const dataForBroadcasting = {
      type: 'SET_STATE',
      data: {
        $handler: $caughtHandlerHtml,
        name: caughtHandlerName,
        value: minValue,
      }
    }
    this.eventObserver.broadcast(dataForBroadcasting);
  }

  public setTooltipActivity(isTooltipActive): void {
    [this.handlerMinValue, this.handlerMaxValue].map((currentHandler) => {
      if (currentHandler) {
        const tooltipPercent = currentHandler.statePercent || this.model.getOption('minValue');
        currentHandler.instances.tooltip.eventObserver.broadcast({ isTooltipActive, tooltipPercent });
      }
    });
  }

  private drawSliderInstances() {
    // console.log(this.model.getState());
    const valueType = this.model.getOption('valueType');
    this.sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.handlerMinValue = {
      name: valueType === 'singleValue' ? 'min-value' : 'min-value',
      instances: this.drawHandlerInstances(this.sliderBody.$mainHtml),
    };

    this.initHandlerEvents(this.handlerMinValue);
    setTimeout(() => {
      this.setState('min-value');
     }, 0)

    if (valueType === 'doubleValue') {
      this.handlerMaxValue = {
        name: 'max-value',
        instances: this.drawHandlerInstances(this.sliderBody.$mainHtml)
      };

      this.initHandlerEvents(this.handlerMaxValue);
      setTimeout(() => {
        this.setState('max-value');
      }, 0)
    }

    if (this.model.getOption('isShowLabels')) {
      this.changeBreakpointsActivity();
    }

    this.initSliderBodyEvents();
  }

  private initSliderBodyEvents(): void {
    this.sliderBody.eventObserver.subscribe((event) => {
      switch (event.type) {
        case 'WINDOW_RESIZE':
          this.changeBreakpointsActivity();
          this.eventObserver.broadcast({ type: 'REFRESH_STATE' });
          break;
        case 'CHANGE_STATE_BY_CLICK':
          this.moveHandlerByBodyClick(event);
          break
        default:
          break;
      }
    });
  }

  private moveHandlerByBodyClick(event): void {
    console.log(event)
    const targetPercent = this.convertPxToPercent(event.caughtCoords);
    const currentState = this.model.getState();
    let availableHandlerValues: any = [];

    for (let handler in currentState) {
      availableHandlerValues.push(currentState[handler].value);
    }

    const findTheClosest = (array, base) => {
      let theClosest = Infinity;
      let temp, arrayElement;

      array.map((_element, i) => {
        temp = Math.abs(array[i] - base);

        if (temp < theClosest) {
          theClosest = temp;
          arrayElement = array[i];
        }
      });

      return arrayElement;
    }

    const findAvailableHandler = findTheClosest(availableHandlerValues, targetPercent);

    Object.values(currentState).map((handler) => {
      if (handler.value === findAvailableHandler) {
        const dataForBroadcasting = {
          type: 'SET_STATE',
          data: {
            $handler: handler.$handler,
            name: handler.name,
            value: targetPercent,
          }
        }
        this.eventObserver.broadcast(dataForBroadcasting);
      }
    });
  }

  private drawSliderContainer(htmlContainer: JQuery<HTMLElement> | HTMLElement): JQuery<HTMLElement> {
    this.$sliderContainer = $('<div/>', {
      class: 'slider__container'
    }).appendTo(htmlContainer);

    return this.$sliderContainer;
  }

  private drawSliderBody($HtmlContainer): SliderBodyView {
    const sliderBody: SliderBodyView = new SliderBodyView($HtmlContainer, this.model.axis);
    return sliderBody;
  }

  private getConvertedBreakpoints() {
    const pointerWidth: number = this.handlerMinValue.instances.handler.getHandlerWidth();
    const maxContainerWidth: number = this.sliderBody.getSliderBodyParams();

    return this.model.getOption('breakpoints').map((currentPercent) => {
      const optionList = {
        minPercent: this.model.getOption('minValue'),
        maxPercent: this.model.getOption('maxValue'),
        currentPercent,
        maxContainerWidth,
      };

      return {
        currentPercent,
        pixelPosition: this.validateView.convertPercentToPixel(optionList)
      };
    })
  }

  public changeBreakpointsActivity(): void {
    const availableBreakpoints = this.getConvertedBreakpoints();

    const isActiveBreakpoints = this.model.getOption('isShowLabels');

    const broadcastingData = {
      isActiveBreakpoints,
      breakpoints: isActiveBreakpoints ? availableBreakpoints : false,
      type: 'SET_BREAKPOINTS_ACTIVITY',
    };

    this.sliderBody.eventObserver.broadcast(broadcastingData);
  }

  private drawHandlerInstances($HtmlContainer): object {
    const sliderHandler = new HandlerView($HtmlContainer, this.model.getOption('axis'));
    const handlerTooltip: TooltipView = new TooltipView(sliderHandler.$html, this.model.getOption('axis'));

    const isTooltipActive = this.model.getOption('isEnabledTooltip');
    const tooltipPercent = this.model.getOption('minValue');

    if (isTooltipActive) {
      handlerTooltip['eventObserver'].broadcast({ isTooltipActive, tooltipPercent });
    }

    return {
      handler: sliderHandler,
      tooltip: handlerTooltip
    };
  }

  private initHandlerEvents(parent): void {
    parent.instances.handler.observer.subscribe((event) => {
      switch (event.type) {
        case this.validateView.mouseDownEvent:
          this.handleHandlerMouseDown(event.data);
          break;
        case this.validateView.mouseMoveEvent:
          this.handleHandlerMove({
            $handler: parent.instances.handler.$html,
            event: event.data,
            name: parent.name,
          });
          break;
        default:
          return false;
      };
    });
  }

  public setAxis(axis: string): void {
    this.sliderBody.setAxis(axis);
    this.refreshView();
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

      const valueType = this.model.getOption('valueType');

      const minValueHandlerName = valueType === 'singleValue' ? 'min-value' : 'min-value';
      const maxValueHandlerName = 'max-value';

      switch (handler.name) {
        case minValueHandlerName:
          this.handlerMinValue.instances.handler.moveHandler(newHandlerPosition);
          this.handlerMinValue.statePercent = currentPercent;

          if (this.isEnabledTooltip()) {
            this.handlerMinValue.instances.tooltip.setValue(currentPercent);
          }

          break
        case maxValueHandlerName:
          this.handlerMaxValue.instances.handler.moveHandler(newHandlerPosition);
          this.handlerMaxValue.statePercent = currentPercent;

          if (this.isEnabledTooltip()) {
            this.handlerMaxValue.instances.tooltip.setValue(currentPercent);
          }

          break
        default:
          return false;
      }
    });
  }

  private isEnabledTooltip(): boolean {
    return this.model.getOption('isEnabledTooltip');
  }

  private setPointerShift(newShift): void {
    this.validateView.setPointerShift(newShift);
  }

  private handleHandlerMouseDown(e) {
    e.preventDefault();
    const $caughtHandler: JQuery<HTMLElement> = $(e.target);
    const shift = e.clientX - $caughtHandler[0].getBoundingClientRect().left;
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
    const shift = this.validateView.getPointerShift();
    const currentPixel = this.model.axis === 'X' ?
      event.clientX - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().left
      :
      event.clientY - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().top;

    const value = this.convertPxToPercent(currentPixel);
    const dataForBroadcasting = {
      type: 'SET_STATE',
      data: {
        $handler,
        value,
        name,
      }
    }
    this.eventObserver.broadcast(dataForBroadcasting);

    return value;
  }
}

export default View;