import Observer from '../../Observer/Observer';
import СustomEvents from '../../Observer/CustomEvents';

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

  public setValue(percent: number): void {
    this.$tooltip.text(percent);
  }

  public drawTooltip(): JQuery<HTMLElement> {
    this.$tooltip = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__tooltip slider__tooltip_type_horizontal'
        : 'slider__tooltip slider__tooltip_type_vertical',
    }).appendTo(this.$htmlParent);
    return this.$tooltip;
  }

  public removeTooltip(): void {
    this.$tooltip.remove();
  }

  private listenEvents() {
    this.eventObserver.subscribe((event) => {
      switch (event.type) {
        case СustomEvents.SetTooltipActivity:
          if (event.data.isTooltipActive) {
            this.drawTooltip();
            this.setValue(event.data);
          } else {
            this.removeTooltip();
          }
          break;
        case СustomEvents.SetTooltipValue:
          this.setValue(event.data);
          break;
        default:
          break;
      }
    });
  }
}

export default TooltipView;
