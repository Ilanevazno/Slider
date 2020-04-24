import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import ValidateView from './ValidateView/ValidateView';

class View {
  private $sliderContainer: JQuery<HTMLElement>
  private $sliderBody: JQuery<HTMLElement>
  private $handlerMinValue: JQuery<HTMLElement>
  private $handlerMaxValue: JQuery<HTMLElement>

  public eventObserver: Observer;
  private validateView: ValidateView;

  constructor(private model: Model, initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.validateView = new ValidateView();

    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);
    this.$sliderBody = this.drawSliderBody();
    this.$handlerMinValue = this.drawSliderHandler();
    this.$handlerMaxValue = this.drawSliderHandler();
    this.drawSliderToolTip(this.$handlerMinValue);
    this.drawSliderToolTip(this.$handlerMaxValue);
  }

  public validateNewHandlerPosition(currentHandler) {
    Object.values(currentHandler).map((handler: any) => {
      const $caughtHandler = $(handler.$handler);
      const newStatePercent: number = handler.value;
      const maxSliderWidth: number = this.$sliderBody[0].offsetWidth - ($caughtHandler[0].offsetWidth / 2);
      const minSliderWidth: number = 0;
      const newHandlerPosition: number = this.validateView.convertPercentToPixel(maxSliderWidth, newStatePercent);

      const validateNewPosition = (): boolean => {
        if (newHandlerPosition <= maxSliderWidth && newHandlerPosition >= minSliderWidth) {
          return true;
        }

        return false;
      }

      if (validateNewPosition()) {
        this.moveHandler($caughtHandler, newHandlerPosition);
        this.setToolTipValue($caughtHandler.children(), newStatePercent);
      }
    });
  }

  private checkCollision(): boolean {
    const handlerMinValue = 0;
    const handlerMaxValue = 0;

    return false;
  }

  private moveHandler($currentHandler: JQuery<HTMLElement>, newPosition: number): void {
    $currentHandler.css('left', `${newPosition}px`);
  }

  private drawSliderContainer(htmlContainer: JQuery<HTMLElement> | HTMLElement): JQuery<HTMLElement> {
    this.$sliderContainer = $('<div/>', {
      class: 'slider__container'
    }).appendTo(htmlContainer);

    return this.$sliderContainer;
  }

  private setToolTipValue($tooltipElement: JQuery<HTMLElement>, newValue: number): void {
    $tooltipElement.text(newValue);
  }

  private drawSliderBody(): JQuery<HTMLElement> {
    this.$sliderBody = $('<div/>', {
      class: 'slider__body'
    }).appendTo(this.$sliderContainer);

    return this.$sliderBody;
  }

  private drawSliderHandler(): JQuery<HTMLElement> {
    const $sliderHandler = $('<div/>', {
      class: 'slider__handler'
    }).appendTo(this.$sliderBody);

    setTimeout(() => {
      this.eventObserver.broadcast({ $handler: $sliderHandler, value: this.model.minValue, });
    }, 0)
    $sliderHandler.on('mousedown.documentMouseDown', this.handleHandlerMouseDown.bind(this))

    return $sliderHandler;
  }

  private drawSliderToolTip($sliderHandler: JQuery<HTMLElement>): JQuery<HTMLElement> {
    const sliderToolTip = $('<div/>', {
      class: 'slider__tooltip'
    })
      .appendTo($sliderHandler)
      .text(this.model.minValue);

    return sliderToolTip;
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

    $(document).on('mousemove.documentMouseMove', this.handleDocumentMouseMove.bind(this, $caughtHandler));
  }

  private handleDocumentMouseMove($handler: JQuery<HTMLElement>, e): number {
    const shift = this.validateView.getPointerShift();
    const newHandlerPosition = e.clientX - shift - this.$sliderBody[0].getBoundingClientRect().left;
    const value = this.validateView.convertPixelToPercent(this.$sliderBody[0].offsetWidth, newHandlerPosition);

    this.eventObserver.broadcast({ $handler, value });

    $(document).on('mouseup.documentMouseUp', this.handleDocumentMouseUp.bind(this));

    return value;
  }

  private handleDocumentMouseUp(): void {
    $(document).off('.documentMouseMove');
  }

}

export default View;