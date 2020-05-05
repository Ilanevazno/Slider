import Observer from '../../Observer/Observer';

class TooltipView {
  private $tooltip: JQuery<HTMLElement>;
  private $htmlParent: JQuery<HTMLElement>;
  private axis: string;
  private eventObserver: Observer;

  constructor($htmlcontainer, axis) {
    this.$htmlParent = $htmlcontainer;
    this.eventObserver = new Observer();
    this.listenEvents();
    this.axis = axis;
    this.$tooltip = this.drawTooltip($htmlcontainer);
  }

  private listenEvents() {
    this.eventObserver.subscribe((event) => {
      if (event.isTooltipActive) {
        this.drawTooltip(this.$htmlParent)
        // this.setValue(event.currentValue)
      } else {
        this.removeTooltip();
      }
    });
  }

  public setValue(percent): void {
    this.$tooltip.text(percent);
  }

  private drawTooltip($htmlContainer): JQuery<HTMLElement> {
    this.$tooltip = $('<div/>', {
      class: this.axis === 'X' ?
        'slider__tooltip slider__tooltip_type_horizontal'
        :
        'slider__tooltip slider__tooltip_type_vertical'
    }).appendTo($htmlContainer);
    return this.$tooltip;
  }

  public removeTooltip(): void {
    this.$tooltip.remove();
  }
}

export default TooltipView;