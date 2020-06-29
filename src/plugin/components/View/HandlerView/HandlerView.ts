import { Axis, ConvertingData } from '../../types/types';
import Observer from '../../Observer/Observer';
import TooltipView from '../TooltipView/TooltipView';

class HandlerView {
  public $handler: JQuery<HTMLElement>;

  public observer: Observer;

  private offset: number;

  private tooltip: TooltipView;

  constructor($htmlContainer: JQuery<HTMLElement>, private axis: Axis) {
    this.axis = axis;
    this.$handler = this.drawHandler($htmlContainer);
    this.tooltip = new TooltipView(this.$handler, this.axis);
    this.observer = new Observer();

    useAutoBind(this);
    this.initEvents();
  }

  public move(newHandlerPosition: number): void {
    const direction: string = this.axis === 'X' ? 'left' : 'top';
    this.$handler.css(direction, `${newHandlerPosition}px`);
  }

  public calculateNewPosition(data: ConvertingData): void {
    const {
      minPercent,
      maxPercent,
      currentValue,
      maxValue,
    } = data;
    const newPosition = ((currentValue - minPercent) / (maxPercent - minPercent)) * (maxValue - this.getWidth());

    this.move(newPosition);
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
    const data = {
      posX: (event.clientX || event.touches[0].clientX) - (this.offset / 2),
      poxY: (event.clientX || event.touches[0].clientY) - (this.offset / 2),
    };

    this.observer.broadcast({ type: `HANDLER_${event.type.toUpperCase()}`, data });
  }

  private handleDocumentMouseUp(): void {
    $(document).off('.documentMouseMove .documentTouchMove');
  }
}

export default HandlerView;
