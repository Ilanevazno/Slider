import { Axis } from '../../types/types';

class TooltipView {
  constructor(
    private readonly $htmlContainer: JQuery<HTMLElement>,
    private readonly axis: Axis,
    private $tooltip?: JQuery<HTMLElement>,
  ) {
    this.$tooltip = null;
  }

  public setValue(percent: number): void {
    this.$tooltip.text(percent);

    if (this.axis === 'X') {
      if (this.$tooltip.width() > this.$htmlContainer.width()) {
        const newHandlerPosition = (this.$tooltip.width() - this.$htmlContainer.width()) / 2;
        this.$tooltip.css('left', 0 - newHandlerPosition);
      } else {
        this.$tooltip.css('left', 0);
      }
    }
  }

  public draw(): JQuery<HTMLElement> {
    this.$tooltip = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__tooltip slider__tooltip_type_horizontal'
        : 'slider__tooltip slider__tooltip_type_vertical',
    }).appendTo(this.$htmlContainer);

    return this.$tooltip;
  }

  public remove(): JQuery<HTMLElement> {
    return this.$tooltip.remove();
  }
}

export default TooltipView;
