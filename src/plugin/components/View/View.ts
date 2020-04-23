import Model from '../Model/Model';
import Observer from '../Observer/Observer';
import ValidateView from './ValidateView/ValidateView';

class View {
  private $sliderContainer: JQuery<HTMLElement>
  private $sliderBody: JQuery<HTMLElement>
  private $sliderHandler: JQuery<HTMLElement>
  private $sliderToolTip: JQuery<HTMLElement>

  public eventObserver: Observer;
  private validateView: ValidateView;

  constructor(private model: Model, initHtmlElement: HTMLElement) {
    this.eventObserver = new Observer();
    this.validateView = new ValidateView();

    this.$sliderContainer = this.drawSliderContainer(initHtmlElement);
    this.$sliderBody = this.drawSliderBody();
    this.$sliderHandler = this.drawSliderHandler();
    this.$sliderToolTip = this.drawSliderToolTip();
  }

  public validateNewHandlerPosition (currentPercent) {
    const maxSliderWidth: number = this.$sliderBody[0].offsetWidth - (this.$sliderHandler[0].offsetWidth / 2);
    const minSliderWidth: number = 0;
    const newHandlerPosition:number = this.validateView.convertPercentToPixel(maxSliderWidth, currentPercent);

    if (newHandlerPosition <= maxSliderWidth && newHandlerPosition >= minSliderWidth) {
      this.moveHandler(newHandlerPosition);
      this.setToolTipValue(currentPercent);
    }
  }

  private moveHandler (newPosition: number): void {
    this.$sliderHandler.css('left', `${newPosition}px`);
  }

  private drawSliderContainer (htmlContainer: JQuery<HTMLElement> | HTMLElement): JQuery<HTMLElement> {
    this.$sliderContainer = $('<div/>', {
      class: 'slider__container'
    }).appendTo(htmlContainer);

    return this.$sliderContainer;
  }

  private setToolTipValue (newValue: number): void {
    this.$sliderToolTip.text(newValue);
  }

  private drawSliderBody (): JQuery<HTMLElement> {
    this.$sliderBody = $('<div/>', {
      class: 'slider__body'
    }).appendTo(this.$sliderContainer);

    return this.$sliderBody;
  }

  private drawSliderHandler (): JQuery<HTMLElement> {
    this.$sliderHandler = $('<div/>', {
      class: 'slider__handler'
    }).appendTo(this.$sliderBody);

    return this.$sliderHandler;
  }

  private drawSliderToolTip (): JQuery<HTMLElement> {
    this.$sliderToolTip = $('<div/>', {
      class: 'slider__tooltip'
    })
      .appendTo(this.$sliderHandler)
      .text(this.model.minValue);

    return this.$sliderToolTip;
  }

  public initEvents(): void {
    this.$sliderHandler.on('mousedown.documentMouseDown', this.handleHandlerMouseDown.bind(this));
  }

  private setPointerShift (newShift): void {
    this.validateView.setPointerShift(newShift);
  }

  private handleHandlerMouseDown (e) {
    e.preventDefault();

    const shift = e.clientX - this.$sliderHandler[0].getBoundingClientRect().left;
    this.setPointerShift(shift);

    $(document).on('mousemove.documentMouseMove', this.handleDocumentMouseMove.bind(this));
  }

  private handleDocumentMouseMove (e): number {
    const shift = this.validateView.getPointerShift();
    const newHandlerPosition = e.clientX - shift - this.$sliderBody[0].getBoundingClientRect().left;
    const newHandlerPercent = this.validateView.convertPixelToPercent(this.$sliderBody[0].offsetWidth, newHandlerPosition);

    this.eventObserver.broadcast({ newHandlerPercent });

    $(document).on('mouseup.documentMouseUp', this.handleDocumentMouseUp.bind(this));

    return newHandlerPercent;
  }

  private handleDocumentMouseUp (): void {
    $(document).off('.documentMouseMove');
  }

}

export default View;