class TooltipView {
  private $tooltip: JQuery<HTMLElement>;

  constructor ($htmlcontainer) {
    this.$tooltip = this.drawTooltip($htmlcontainer);
  }

  public setValue (percent): void {
    this.$tooltip.text(percent);
  }

  private drawTooltip ($htmlContainer): JQuery<HTMLElement> {
    const tooltip: JQuery<HTMLElement> = $('<div/>', {
      class: 'slider__tooltip'
    }).appendTo($htmlContainer);
    return tooltip;
  }
}

export default TooltipView;