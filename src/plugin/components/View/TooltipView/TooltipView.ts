class TooltipView {
  private $tooltip: JQuery<HTMLElement>;

  private $htmlParent: JQuery<HTMLElement>;

  constructor($HTMLContainer, private axis: string) {
    this.$tooltip = null;
    this.$htmlParent = $HTMLContainer;
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
}

export default TooltipView;
