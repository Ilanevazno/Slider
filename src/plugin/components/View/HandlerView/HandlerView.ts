import { Axis, ConvertingData } from '../../types/types';
import Observer from '../../Observer/Observer';
import TooltipView from '../TooltipView/TooltipView';
import MainView from '../MainView';

class HandlerView {
  public $handler: JQuery<HTMLElement>;

  public observer: Observer;

  private offset: number;

  private tooltip: TooltipView;

  private axis: Axis;

  public value: number;

  constructor(private mainView: MainView) {
    this.axis = this.mainView.model.getOption('axis');
    this.$handler = this.drawHandler(this.mainView.sliderBody.$sliderBody);
    this.tooltip = new TooltipView(this.$handler, this.axis);
    this.observer = new Observer();

    useAutoBind(this);
    this.initEvents();
  }

  private calculateNewPosition(data: ConvertingData): number {
    const {
      minPercent,
      maxPercent,
      currentValue,
      maxContainerSize,
    } = data;
    return ((currentValue - minPercent) / (maxPercent - minPercent)) * (maxContainerSize - this.getWidth());
  }

  public move(data: ConvertingData): void {
    const newPosition: number = this.calculateNewPosition(data);
    const direction: string = this.axis === 'X' ? 'left' : 'top';

    this.$handler.css(direction, `${newPosition}px`);
  }

  public getTooltip(): void {
    this.tooltip.draw();
  }

  public setTooltipValue(value: number): void {
    this.tooltip.setValue(value);
  }

  public changeTooltipActivity(isActive: boolean) {
    return isActive
      ? this.tooltip.draw()
      : this.tooltip.remove();
  }

  public getWidth() {
    return this.$handler.width();
  }

  private drawHandler($htmlContainer: JQuery<HTMLElement>): JQuery<HTMLElement> {
    const handler: JQuery<HTMLElement> = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__handler slider__handler_type_horizontal'
        : 'slider__handler slider__handler_type_vertical',
    }).appendTo($htmlContainer);

    return handler;
  }

  private initEvents(): void {
    this.$handler.on('touchstart.handlerTouchStart mousedown.handlerMouseDown', this.handleHandlerMouseDown);
  }

  private handleHandlerMouseDown(event): void {
    event.preventDefault();
    this.offset = this.axis === 'X'
      ? (event.clientX || event.touches[0].clientX) - this.$handler[0].getBoundingClientRect().left
      : (event.clientY || event.touches[0].clientY) - this.$handler[0].getBoundingClientRect().top;

    this.observer.broadcast({ type: `HANDLER_${event.type.toUpperCase()}`, data: event });
    $(document).on('touchmove.documentTouchMove mousemove.documentMouseMove', this.handleDocumentMouseMove);
    $(document).on('touchend.documentTouchEnd mouseup.documentMouseUp', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseMove(event): void {
    const position = this.axis === 'X'
      ? event.clientX || event.touches[0].clientX
      : event.clientX || event.touches[0].clientY;
    const direction = this.axis === 'X' ? 'left' : 'top';
    const currentPixel = (position - (this.offset / 2)) - this.mainView.sliderBody.$sliderBody[0].getBoundingClientRect()[direction];
    const minPercent: number = this.mainView.model.getOption<number>('minAvailableValue');
    const maxPercent: number = this.mainView.model.getOption<number>('maxAvailableValue');
    const maxValue: number = this.mainView.sliderBody.getSliderBodyParams();
    const value = (currentPixel * (maxPercent - minPercent)) / maxValue + minPercent;

    this.observer.broadcast({ type: `HANDLER_${event.type.toUpperCase()}`, data: { value } });
  }

  private handleDocumentMouseUp(): void {
    $(document).off('.documentMouseMove .documentTouchMove');
  }
}

export default HandlerView;
