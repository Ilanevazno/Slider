import { Axis } from '../../types/types';

class TooltipView {
  private $tooltip: JQuery<HTMLElement>;

  constructor(private $htmlContainer: JQuery<HTMLElement>, private axis: Axis) {
    this.$tooltip = null;
  }

  public setValue(percent: number): void {
    this.$tooltip.text(percent);

    if (this.$tooltip.width() > this.$htmlContainer.width()) {
      const newHandlerPosition = (this.$tooltip.width() - this.$htmlContainer.width()) / 2;
      this.$tooltip.css('left', 0 - newHandlerPosition);
    } else {
      this.$tooltip.css('left', 0);
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
