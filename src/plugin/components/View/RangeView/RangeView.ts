import {
  Axis, ValueType, ViewHandlerData, rangeSettings,
} from '../../types/types';

class RangeView {
  private $parent: JQuery<HTMLElement>;

  public $range: JQuery<HTMLElement>;

  private axis: Axis;

  private valueType: ValueType;

  private minValueHandler: ViewHandlerData;

  private maxValueHandler: ViewHandlerData;

  constructor(settings: rangeSettings) {
    this.$parent = settings.$parent;
    this.axis = settings.axis;
    this.valueType = settings.valueType;
    this.minValueHandler = settings.handlers.minValue;
    this.maxValueHandler = settings.handlers.maxValue;

    this.draw();
  }

  public update(): void {
    const positionFrom = this.minValueHandler.handler.getPosition() + (this.minValueHandler.handler.getWidth() / 2);
    const positionTo = this.maxValueHandler
      ? this.maxValueHandler.handler.getPosition() + (this.minValueHandler.handler.getWidth() / 2)
      : positionFrom;

    const stylesParams = {
      [this.axis === 'X' ? 'left' : 'top']: this.valueType === ValueType.DOUBLE ? positionFrom : 0,
      [this.axis === 'X' ? 'width' : 'height']: this.valueType === ValueType.DOUBLE ? positionTo - positionFrom : positionTo,
    };

    this.$range.css({ ...stylesParams });
  }

  public draw(): void {
    this.remove();

    const minCurrentPos = this.minValueHandler.handler.getPosition();
    const maxCurrentPos = this.valueType === ValueType.DOUBLE ? this.maxValueHandler.handler.getPosition() : minCurrentPos;

    const positionFrom = this.valueType === ValueType.SINGLE
      ? '0px'
      : `${minCurrentPos}px`;
    const positionTo = this.valueType === ValueType.SINGLE
      ? `${minCurrentPos}px`
      : `${maxCurrentPos - minCurrentPos}px`;

    this.$range = $('<div/>', {
      class: this.axis === 'X'
        ? 'slider__range slider__range_type_horizontal'
        : 'slider__range slider__range_type_vertical',
    }).appendTo(this.$parent)
      .css({
        position: 'absolute',
        height: this.axis === 'X' ? this.$parent.height() : positionTo,
        width: this.axis === 'X' ? positionTo : '100%',
        background: this.minValueHandler.handler.$handler.css('background'),
        left: this.axis === 'X' ? positionFrom : 0,
        top: this.axis === 'X' ? 0 : positionTo,
      });

    this.update();
  }

  private remove(): void {
    this.$parent.find('.slider__range').remove();
  }
}

export default RangeView;
