import {
  ObserverEvent,
  ModelListener,
  ModelResponse,
  CustomEvents,
  ValueType,
  Axis,
  modelState,
} from '../types/types';
import Model from '../Model/Model';
import MainView from '../View/MainView';

class Controller {
  constructor(private model: Model, private view: MainView) {
    this.subscribeViewObserver();
    this.subscribeModelObserver();
  }

  public subscribeToChangeState(callback: Function): void {
    return this.model.eventObserver.subscribe((event: ObserverEvent<ModelListener>) => {
      switch (event.type) {
        case CustomEvents.STATE_CHANGED:
          callback(event.data.state);
          break;
        default:
          break;
      }
    });
  }

  public changeStateByHandlerName(handlerName: string, value: number): void {
    this.model.changeStateByHandlerName(handlerName, value);
  }

  public setValueType(valueType: ValueType): void {
    this.model.setValueType(valueType);
  }

  public showLabels(): void {
    this.model.setLabelsActivity(true);
  }

  public hideLabels(): void {
    this.model.setLabelsActivity(false);
  }

  public showTooltip(): void {
    this.model.showTooltip();
  }

  public hideTooltip(): void {
    this.model.hideTooltip();
  }

  public setAxis(axis: Axis) {
    this.model.setAxis(axis);
  }

  public setStepSize(newStepSize: number): ModelResponse {
    return this.model.setStepSize(newStepSize);
  }

  public setMinValue(value: number): ModelResponse {
    return this.model.setMinValue(value);
  }

  public setMaxValue(value: number): ModelResponse {
    return this.model.setMaxValue(value);
  }

  private subscribeViewObserver(): void {
    this.view.eventObserver.subscribe((event: ObserverEvent<modelState>) => {
      switch (event.type) {
        case CustomEvents.STATE_CHANGED:
          this.model.setState(event.data);
          break;
        case CustomEvents.STATE_REFRESHED:
          this.model.refreshState();
          break;
        case CustomEvents.STATE_CLEARED:
          this.model.clearState();
          break;
        default:
          break;
      }
    });
  }

  private subscribeModelObserver(): void {
    this.model.eventObserver.subscribe((event: ObserverEvent<ModelListener>) => {
      switch (event.type) {
        case CustomEvents.STATE_CHANGED:
          this.view.prepareToMoveHandler(event.data.state);
          break;
        case CustomEvents.VALUE_TYPE_CHANGED:
          this.view.refreshView();
          break;
        case CustomEvents.MIN_VALUE_CHANGED:
        case CustomEvents.MAX_VALUE_CHANGED:
        case CustomEvents.STEP_SIZE_CHANGED:
          this.view.changeBreakpointsActivity();
          break;
        case CustomEvents.AXIS_CHANGED:
          this.view.changeSliderBodyAxis(event.data.axis);
          break;
        case CustomEvents.TOOLTIP_ACTIVITY_CHANGED:
          this.view.setTooltipActivity(event.data.withTooltip);
          break;
        case CustomEvents.LABELS_ACTIVITY_CHANGED:
          this.view.changeBreakpointsActivity();
          break;
        default:
          break;
      }
    });
  }
}

export default Controller;
