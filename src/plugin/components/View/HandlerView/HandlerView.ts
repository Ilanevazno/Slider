import SliderBodyView from '../SliderBodyView/SliderBodyView';
import Observer from '../../Observer/Observer';

class HandlerView {
  public $html: JQuery<HTMLElement>;
  public observer: Observer;

  constructor ($htmlContainer: any) {
    this.$html = this.drawHandler($htmlContainer);
    this.observer = new Observer();
    this.initEvents();
  }

  public moveHandler(newPosition: number): void {
    this.$html.css('left', `${newPosition}px`);
  }

  private drawHandler($htmlContainer): JQuery<HTMLElement> {
    const handler: JQuery<HTMLElement> = $('<div/>', {
      class: 'slider__handler'
    }).appendTo($htmlContainer);

    return handler;
  }

  private initEvents (): void {
    this.$html.on('mousedown.handlerMouseDown', this.handleHandlerMouseDown.bind(this));
  }

  private handleHandlerMouseDown (e): void {
    this.observer.broadcast({ eventType: e.type, event: e });
    $(document).on('mousemove.documentMouseMove', this.handleDocumentMouseMove.bind(this));
  }

  private handleDocumentMouseMove (e): void {
    this.observer.broadcast({ eventType: e.type, event: e });
    $(document).on('mouseup.documentMouseUp', this.handleDocumentMouseUp.bind(this));
  }

  private handleDocumentMouseUp (): void {
    $(document).off('.documentMouseMove');
  }
}

export default HandlerView;