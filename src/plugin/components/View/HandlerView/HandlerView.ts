import Observer from '../../Observer/Observer';

class HandlerView {
  public $html: JQuery<HTMLElement>;
  public observer: Observer;

  constructor ($htmlContainer: JQuery<HTMLElement>, private axis: string) {
    this.axis = axis;
    this.$html = this.drawHandler($htmlContainer);
    this.observer = new Observer();

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
      class: this.axis === 'X' ?
      'slider__handler slider__handler_type_horizontal'
      :
      'slider__handler slider__handler_type_vertical'
    }).appendTo($htmlContainer);

    return handler;
  }

  private initEvents (): void {
    this.$html.on('mousedown.handlerMouseDown', this.handleHandlerMouseDown.bind(this));
  }

  private handleHandlerMouseDown (event): void {
    this.observer.broadcast({ eventType: event.type, event });
    $(document).on('mousemove.documentMouseMove', this.handleDocumentMouseMove.bind(this));
    $(document).on('mouseup.documentMouseUp', this.handleDocumentMouseUp.bind(this));
  }

  private handleDocumentMouseMove (event): void {
    this.observer.broadcast({ eventType: event.type, event });
  }

  private handleDocumentMouseUp (): void {
    $(document).off('.documentMouseMove');
  }
}

export default HandlerView;