import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import ValidateView from './ValidateView/ValidateView';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';
import TooltipView from './TooltipView/TooltipView';

class View {
  private $sliderContainer: JQuery<HTMLElement>
  private sliderBody: SliderBodyView;
  private handlerMinValue: object
  private handlerMaxValue: object

  public eventObserver: Observer;
  private validateView: ValidateView;

  constructor(private model: Model, private initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.validateView = new ValidateView();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);
    this.sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.handlerMinValue = {
      name: 'min-value',
      instances: this.drawHandlerInstances(this.sliderBody.$mainHtml),
    };

    this.handlerMaxValue = {
      name: 'max-value',
      instances: this.drawHandlerInstances(this.sliderBody.$mainHtml)
    };

    if (this.model.getOption('isShowLabels')) {
      this.drawSliderBreakpoints();
    }

    this.initHandlerEvents(this.handlerMinValue);
    this.initHandlerEvents(this.handlerMaxValue);
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

  private drawSliderBreakpoints ():void {
    const pointerWidth: number = this.handlerMaxValue['instances'].handler.getHandlerWidth();
    const maxContainerWidth: number = this.sliderBody.getSliderBodyParams() - (pointerWidth / 2);

    const breakpoints = this.model.setBreakPointList().map((currentPercent) => {
      const optionList = {
        minPercent: this.model.getOption('minValue'),
        maxPercent: this.model.getOption('maxValue'),
        currentPercent,
        maxContainerWidth,
      };

      return this.validateView.convertPercentToPixel(optionList) + (pointerWidth / 2);
    })

    this.sliderBody.drawBreakPoints(breakpoints);
  }

  private drawHandlerInstances($HtmlContainer): object {
    const sliderHandler = new HandlerView($HtmlContainer, this.model.getOption('axis'));
    let handlerTooltip: TooltipView | null = null;

    if (this.model.getOption('isEnabledTooltip')) {
      handlerTooltip = new TooltipView(sliderHandler.$html);

      handlerTooltip.setValue(this.model.getOption('minValue'));
    }

    return {
      handler: sliderHandler,
      tooltip: handlerTooltip
    };
  }

  private initHandlerEvents(parent): void {
    setTimeout(() => {
      this.eventObserver.broadcast({
        $handler: parent.instances.handler.$html,
        value: this.model.getOption('minValue'),
        name: parent.name
      });
    }, 0);

    parent.instances.handler.observer.subscribe((handler) => {
      switch (handler.eventType) {
        case this.validateView.mouseDownEvent:
          this.handleHandlerMouseDown(handler.event);
          break;
        case this.validateView.mouseMoveEvent:
          this.handleHandlerMove({
            $handler: parent.instances.handler.$html,
            event: handler.event,
            name: parent.name,
          });
          break;
        default:
          return false;
      };
    });
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

      switch (handler.name) {
        case 'min-value':
          this.handlerMinValue['instances'].handler.moveHandler(newHandlerPosition);

          if (this.isEnabledTooltip()) {
            this.handlerMinValue['instances'].tooltip.setValue(currentPercent);
          }

          break
        case 'max-value':
          this.handlerMaxValue['instances'].handler.moveHandler(newHandlerPosition);

          if (this.isEnabledTooltip()) {
            this.handlerMaxValue['instances'].tooltip.setValue(currentPercent);
          }

          break
        default:
          return false;
      }
    });
  }

  private isEnabledTooltip (): boolean {
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

  private handleHandlerMove({ $handler, event, name }): number {
    const shift = this.validateView.getPointerShift();
    const currentPixel = this.model.axis === 'X' ?
    event.clientX - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().left
    :
    event.clientY - shift - this.sliderBody.$mainHtml[0].getBoundingClientRect().top;
    const optionsToConvert = {
      containerWidth: this.sliderBody.getSliderBodyParams(),
      minPercent: this.model.getOption('minValue'),
      maxPercent: this.model.getOption('maxValue'),
      currentPixel,
    };
    const value = this.validateView.convertPixelToPercent(optionsToConvert) + this.model.minValue;
    this.eventObserver.broadcast({ $handler, value, name });

    return value;
  }
}

export default View;