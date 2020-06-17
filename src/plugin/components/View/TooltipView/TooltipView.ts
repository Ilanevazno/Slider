import { Axis } from '../../types/types';

class TooltipView {
  private $tooltip: JQuery<HTMLElement>;

  constructor(private $htmlContainer, private axis: Axis) {
    this.$tooltip = null;
  }

  public setValue(percent: number): void {
    this.$tooltip.text(percent);
  }

  public drawTooltip() {
    this.$tooltip = $('<div/>', {
      class: this.axis as unknown as string === 'X'
        ? 'slider__tooltip slider__tooltip_type_horizontal'
        : 'slider__tooltip slider__tooltip_type_vertical',
    }).appendTo(this.$htmlContainer);
    return this.$tooltip;
  }

  public removeTooltip() {
    this.$tooltip.remove();
  }
}

export default TooltipView;
