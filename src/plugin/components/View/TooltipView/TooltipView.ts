import Observer from '../../Observer/Observer';

class TooltipView {
  private $tooltip: any;
  private $htmlParent: JQuery<HTMLElement>;
  private eventObserver: Observer;

  constructor($htmlcontainer, private axis: string) {
    this.$tooltip = null;
    this.$htmlParent = $htmlcontainer;
    this.eventObserver = new Observer();
    this.listenEvents();
    this.axis = axis;
  }

  private listenEvents() {
    this.eventObserver.subscribe((event) => {
      console.log(event);
      if (event.isTooltipActive) {
        this.drawTooltip()
        this.setValue(event.tooltipPercent)
      } else {
        this.removeTooltip();
      }
    });
  }

  public setValue(percent): void {
    this.$tooltip.text(percent);
  }

  public drawTooltip(): JQuery<HTMLElement> {
    this.$tooltip = $('<div/>', {
      class: this.axis === 'X' ?
        'slider__tooltip slider__tooltip_type_horizontal'
        :
        'slider__tooltip slider__tooltip_type_vertical'
    }).appendTo(this.$htmlParent);
    return this.$tooltip;
  }

  public removeTooltip(): void {
    this.$tooltip.remove();
  }
}

export default TooltipView;