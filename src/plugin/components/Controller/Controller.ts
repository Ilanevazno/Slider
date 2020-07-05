import {
  ObserverEvent,
  ModelListener,
  ModelResponse,
  CustomEvents,
  ValueType,
  Axis,
  UnconvertedStateItem,
  HandlerName,
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

  public changeStateByItemName(handlerName: HandlerName, value: number): void {
    this.model.changeStateByItemName(handlerName, value);
  }

  public setValueType(valueType: ValueType): ModelResponse<string> {
    return this.model.setValueType(valueType);
  }

  public setLabelsActivity(isActive: boolean): void {
    this.model.setLabelsActivity(isActive);
  }

  public setTooltipActivity(isActive: boolean): void {
    this.model.setTooltipActivity(isActive);
  }

  public setAxis(axis: Axis): ModelResponse<string> {
    return this.model.setAxis(axis);
  }

  public setStepSize(newStepSize: number): ModelResponse<number> {
    return this.model.setStepSize(newStepSize);
  }

  public setMinAvailableValue(value: number): ModelResponse<number> {
    return this.model.requestToSetMinAvailableValue(value);
  }

  public setMaxAvailableValue(value: number): ModelResponse<number> {
    return this.model.requestToSetMaxAvailableValue(value);
  }

  private subscribeViewObserver(): void {
    this.view.eventObserver.subscribe((event: ObserverEvent<UnconvertedStateItem>) => {
      switch (event.type) {
        case CustomEvents.HANDLER_DID_MOUNT:
        case CustomEvents.BREAKPOINT_CLICKED:
        case CustomEvents.HANDLER_MOUSEMOVE:
          this.model.setState(event.data);
          break;
        case CustomEvents.WINDOW_RESIZED:
        case CustomEvents.VIEW_REFRESHED:
          this.model.refreshState();
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
          this.view.moveHandler(event.data.state);
          break;
        case CustomEvents.VALUE_TYPE_CHANGED:
          this.view.refreshView();
          break;
        case CustomEvents.MIN_AVAILABLE_VALUE_CHANGED:
        case CustomEvents.MAX_AVAILABLE_VALUE_CHANGED:
        case CustomEvents.STEP_SIZE_CHANGED:
          this.view.setBreakpointsActivity();
          break;
        case CustomEvents.AXIS_CHANGED:
          this.view.changeSliderBodyAxis(event.data.axis);
          break;
        case CustomEvents.TOOLTIP_ACTIVITY_CHANGED:
          this.view.setTooltipActivity(event.data.withTooltip);
          break;
        case CustomEvents.LABELS_ACTIVITY_CHANGED:
          this.view.setBreakpointsActivity();
          break;
        default:
          break;
      }
    });
  }
}

export default Controller;
