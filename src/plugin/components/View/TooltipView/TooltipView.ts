import Observer from '../../Observer/Observer';
import * as customEvent from '../../Observer/customEvents';

class TooltipView {
  private $tooltip: any;
  private $htmlParent: JQuery<HTMLElement>;
  public eventObserver: Observer;

  constructor($HTMLContainer, private axis: string) {
    this.$tooltip = null;
    this.$htmlParent = $HTMLContainer;
    this.eventObserver = new Observer();
    this.listenEvents();
    this.axis = axis;
  }

  private listenEvents() {
    this.eventObserver.subscribe((event) => {
      switch (event.type) {
        case customEvent.setTooltipActivity:
          if (event.data.isTooltipActive) {
            this.drawTooltip();
            this.setValue(event.data);
          } else {
            this.removeTooltip();
          }
          break;
        case customEvent.setTooltipValue:
          this.setValue(event.data);
          break;
        default:
          break;
      }
    });
  }

  public setValue(percent): void {
    this.$tooltip.text(percent);
  }

  public drawTooltip(): JQuery<HTMLElement> {
    this.$tooltip = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__tooltip slider__tooltip_type_horizontal'
        : 'slider__tooltip slider__tooltip_type_vertical'
    }).appendTo(this.$htmlParent);
    return this.$tooltip;
  }

  public removeTooltip(): void {
    this.$tooltip.remove();
  }
}

export default TooltipView;