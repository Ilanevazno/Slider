/* eslint-disable @typescript-eslint/unbound-method */
import Observer from '../../Observer/Observer';
import TooltipView from '../TooltipView/TooltipView';

class HandlerView {
  public $html: JQuery<HTMLElement>;

  public observer: Observer;

  private offset: number;

  private tooltip: TooltipView;

  constructor($htmlContainer: JQuery<HTMLElement>, private axis: string) {
    this.axis = axis;
    this.$html = this.drawHandler($htmlContainer);
    this.tooltip = new TooltipView(this.$html, axis);
    this.observer = new Observer();

    useAutoBind(this);
    this.initEvents();
  }

  public moveHandler(newHandlerPosition: number): void {
    const direction: string = this.axis === 'X' ? 'left' : 'top';
    this.$html.css(direction, `${newHandlerPosition}px`);
  }

  public getTooltip(): void {
    this.tooltip.drawTooltip();
  }

  public setTooltipValue(value: number): void {
    this.tooltip.setValue(value);
  }

  public changeTooltipActivity(isActive: boolean): JQuery<HTMLElement> {
    return isActive
      ? this.tooltip.drawTooltip()
      : this.tooltip.removeTooltip();
  }

  public getHandlerWidth() {
    return this.$html.width();
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
    this.$html.on('touchstart.documentTouchStart mousedown.handlerMouseDown', this.handleHandlerMouseDown);
  }

  private handleHandlerMouseDown(event): void {
    this.offset = this.axis === 'X'
      ? event.clientX - this.$html[0].getBoundingClientRect().left
      : event.clientY - this.$html[0].getBoundingClientRect().top;
    this.observer.broadcast({ type: event.type, data: event });
    $(document).on('touchmove.documentTouchMove mousemove.documentMouseMove', this.handleDocumentMouseMove);
    $(document).on('touchend.documentTouchEnd mouseup.documentMouseUp', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseMove(event): void {
    const offset = this.offset / 2;
    this.observer.broadcast({ type: event.type.toUpperCase(), data: { event, offset } });
  }

  private handleDocumentMouseUp(): void {
    $(document).off('.documentMouseMove .documentTouchMove');
  }
}

export default HandlerView;
