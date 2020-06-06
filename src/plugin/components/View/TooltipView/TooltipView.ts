import { Axis } from '../../types/types';

class TooltipView {
  private $tooltip: JQuery<HTMLElement>;

  private $htmlParent: JQuery<HTMLElement>;

  constructor($HTMLContainer, private axis: Axis) {
    this.$tooltip = null;
    this.$htmlParent = $HTMLContainer;
    this.axis = axis;
  }

  public setValue(percent: number): void {
    this.$tooltip.text(percent);
  }

  public drawTooltip(): JQuery<HTMLElement> {
    this.$tooltip = $('<div/>', {
      class: this.axis as unknown as string === 'X'
        ? 'slider__tooltip slider__tooltip_type_horizontal'
        : 'slider__tooltip slider__tooltip_type_vertical',
    }).appendTo(this.$htmlParent);
    return this.$tooltip;
  }

  public removeTooltip(): JQuery<HTMLElement> {
    return this.$tooltip.remove();
  }
}

export default TooltipView;
