import SliderBodyView from '../SliderBodyView/SliderBodyView';
import Observer from '../../Observer/Observer';

class HandlerView {
  public $html: JQuery<HTMLElement>;
  public observer: Observer;
  private axis: string;

  constructor ($htmlContainer: any, axis: string) {
    this.axis = axis;
    this.$html = this.drawHandler($htmlContainer);
    this.observer = new Observer();
    this.initEvents();
  }

  public moveHandler(newPosition: number): void {
    const direction = this.axis === 'X' ? 'left' : 'top';
    this.$html.css(direction, `${newPosition}px`);
  }

  public getHandlerWidth() {
    return this.$html.width();
  }

  private drawHandler($htmlContainer): JQuery<HTMLElement> {
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

  private handleHandlerMouseDown (e): void {
    this.observer.broadcast({ eventType: e.type, event: e });
    $(document).on('mousemove.documentMouseMove', this.handleDocumentMouseMove.bind(this));
    $(document).on('mouseup.documentMouseUp', this.handleDocumentMouseUp.bind(this));
  }

  private handleDocumentMouseMove (e): void {
    this.observer.broadcast({ eventType: e.type, event: e });
  }

  private handleDocumentMouseUp (): void {
    $(document).off('.documentMouseMove');
  }
}

export default HandlerView;