import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import ValidateView from './ValidateView/ValidateView';
import SliderBodyView from './SliderBodyView/SliderBodyView';
import HandlerView from './HandlerView/HandlerView';
import TooltipView from './TooltipView/TooltipView';

class View {
  private $sliderContainer: JQuery<HTMLElement>
  private $sliderBody: SliderBodyView | JQuery<HTMLElement>;
  private handlerMinValue: object
  private handlerMaxValue: object

  public eventObserver: Observer;
  private validateView: ValidateView;

  constructor(private model: Model, private initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.validateView = new ValidateView();
    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);
    this.$sliderBody = this.drawSliderBody(this.$sliderContainer);
    this.handlerMinValue = {
      name: 'min-value',
      instances: this.drawHandlerInstances(this.$sliderBody),
    };

    this.handlerMaxValue = {
      name: 'max-value',
      instances: this.drawHandlerInstances(this.$sliderBody)
    };

    this.initHandlerEvents(this.handlerMinValue);
    this.initHandlerEvents(this.handlerMaxValue);
  }

  private drawSliderContainer(htmlContainer: JQuery<HTMLElement> | HTMLElement): JQuery<HTMLElement> {
    this.$sliderContainer = $('<div/>', {
      class: 'slider__container'
    }).appendTo(htmlContainer);

    return this.$sliderContainer;
  }

  private drawSliderBody($HtmlContainer): JQuery<HTMLElement> {
    const sliderBody = new SliderBodyView($HtmlContainer);
    return sliderBody.$htmlContainer;
  }

  private drawHandlerInstances($HtmlContainer): object {
    const sliderHandler = new HandlerView($HtmlContainer);
    let handlerTooltip: TooltipView | null = null;

    if (this.model.isEnabledTooltip) {
      handlerTooltip = new TooltipView(sliderHandler.$html);

      handlerTooltip.setValue(this.model.minValue);
    }

    return {
      handler: sliderHandler,
      tooltip: handlerTooltip
    };
  }

  private initHandlerEvents(parent): void {
    setTimeout(() => {
      this.eventObserver.broadcast({ $handler: parent.instances.handler.$html, value: this.model.minValue, name: parent.name });
    }, 0);

    parent.instances.handler.observer.subscribe((handler) => {
      if (handler.eventType === this.validateView.mouseDownEvent) {
        this.handleHandlerMouseDown(handler.event);
      } else if (handler.eventType === this.validateView.mouseMoveEvent) {
        this.handleHandlerMove({
          $handler: parent.instances.handler.$html,
          e: handler.event,
          name: parent.name,
        });
      }
    });
  }

  public validateNewHandlerPosition(currentHandler) {
    Object.values(currentHandler).map((handler: any) => {
      const $caughtHandler = $(handler.$handler);
      const newStatePercent: number = handler.value;
      const maxSliderWidth: number = this.$sliderBody[0].offsetWidth - ($caughtHandler[0].offsetWidth / 2);
      const newHandlerPosition: number = this.validateView.convertPercentToPixel(maxSliderWidth, newStatePercent);

      switch (handler.name) {
        case 'min-value':
          this.handlerMinValue['instances'].handler.moveHandler(newHandlerPosition);

          if (this.isEnabledTooltip()) {
            this.handlerMinValue['instances'].tooltip.setValue(newStatePercent);
          }

          break
        case 'max-value':
          this.handlerMaxValue['instances'].handler.moveHandler(newHandlerPosition);

          if (this.isEnabledTooltip()) {
            this.handlerMaxValue['instances'].tooltip.setValue(newStatePercent);
          }

          break
        default:
          return false;
      }
    });
  }

  private isEnabledTooltip (): boolean {
    return this.model.isEnabledTooltip ? true : false;
  }

  public initEvents(): void {

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

  private handleHandlerMove({ $handler, e, name }): number {
    const shift = this.validateView.getPointerShift();
    const newHandlerPosition = e.clientX - shift - this.$sliderBody[0].getBoundingClientRect().left;
    const value = this.validateView.convertPixelToPercent(this.$sliderBody[0].offsetWidth, newHandlerPosition);
    this.eventObserver.broadcast({ $handler, value, name });

    return value;
  }
}

export default View;