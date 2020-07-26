import {
  Axis, ValueType, ViewHandlerData,
} from '../../types/types';

class RangeView {
  private $parent: JQuery<HTMLElement>;

  public $range: JQuery<HTMLElement>;

  private axis: Axis;

  private valueType: ValueType;

  private minValueHandler: ViewHandlerData;

  private maxValueHandler: ViewHandlerData;

  constructor(settings) {
    this.$parent = settings.$parent;
    this.draw(settings);

    this.axis = settings.axis;
    this.valueType = settings.valueType;
  }

  public update(): void {
    const positionFrom = this.minValueHandler.handler.getPosition() + (this.minValueHandler.handler.getWidth() / 2);
    const positionTo = this.maxValueHandler
      ? this.maxValueHandler.handler.getPosition() + (this.minValueHandler.handler.getWidth() / 2)
      : positionFrom;

    const stylesParams = {
      [this.axis === 'X' ? 'left' : 'top']: this.valueType === 'double' ? positionFrom : 0,
      [this.axis === 'X' ? 'width' : 'height']: this.valueType === 'double' ? positionTo - positionFrom : positionTo,
    };

    this.$range.css({ ...stylesParams });
  }

  public draw(settings): void {
    this.remove();

    const {
      axis,
      valueType,
      handlers,
      $parent,
    } = settings;

    this.minValueHandler = handlers.minValue;
    this.maxValueHandler = handlers.maxValue;

    const minCurrentPos = handlers.minValue.handler.getPosition();
    const maxCurrentPos = valueType === 'double' ? handlers.maxValue.handler.getPosition() : minCurrentPos;

    const positionFrom = valueType === 'single'
      ? '0px'
      : `${minCurrentPos}px`;
    const positionTo = valueType === 'single'
      ? `${minCurrentPos}px`
      : `${maxCurrentPos - minCurrentPos}px`;

    this.$range = $('<div/>', {
      class: axis === 'X'
        ? 'slider__range slider__range_type_horizontal'
        : 'slider__range slider__range_type_vertical',
    }).appendTo($parent)
      .css({
        position: 'absolute',
        height: axis === 'X' ? $parent.height() : positionTo,
        width: axis === 'X' ? positionTo : '100%',
        background: this.minValueHandler.handler.$handler.css('background'),
        left: axis === 'X' ? positionFrom : 0,
        top: axis === 'X' ? 0 : positionTo,
      });
  }

  private remove(): void {
    this.$parent.find('.slider__range').remove();
  }
}

export default RangeView;
