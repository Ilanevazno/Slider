/* eslint-disable @typescript-eslint/unbound-method */
import Observer from '../../Observer/Observer';

class HandlerView {
  public $html: JQuery<HTMLElement>;

  public observer: Observer;

  constructor($htmlContainer: JQuery<HTMLElement>, private axis: string) {
    this.axis = axis;
    this.$html = this.drawHandler($htmlContainer);
    this.observer = new Observer();

    useAutoBind(this);
    this.initEvents();
  }

  public moveHandler(newHandlerPosition: number): void {
    const direction: string = this.axis === 'X' ? 'left' : 'top';
    this.$html.css(direction, `${newHandlerPosition}px`);
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
    this.observer.broadcast({ type: event.type, data: event });
    $(document).on('touchmove.documentTouchMove mousemove.documentMouseMove', this.handleDocumentMouseMove);
    $(document).on('touchend.documentTouchEnd mouseup.documentMouseUp', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseMove(event): void {
    this.observer.broadcast({ type: event.type, data: event });
  }

  private handleDocumentMouseUp(): void {
    $(document).off('.documentMouseMove .documentTouchMove');
  }
}

export default HandlerView;
