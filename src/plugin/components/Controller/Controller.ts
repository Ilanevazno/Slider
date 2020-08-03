import {
  ObserverEvent,
  ModelListener,
  CustomEvents,
  ValueType,
  Axis,
  UnconvertedStateItem,
  HandlerName,
} from '../types/types';
import Model from '../Model/Model';
import MainView from '../View/MainView';

class Controller {
  constructor(private readonly model: Model, private readonly view: MainView) {
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

  public changeStateByItemName(name: HandlerName, value: number): void {
    this.model.setState({ name, value });
  }

  public setValueType(valueType: ValueType): void {
    return this.model.setValueType(valueType);
  }

  public setLabelsAvailability(isActive: boolean): void {
    this.model.setLabelsAvailability(isActive);
  }

  public setTooltipAvailability(isActive: boolean): void {
    this.model.setTooltipAvailability(isActive);
  }

  public setAxis(axis: Axis): void {
    return this.model.setAxis(axis);
  }

  public setStepSize(newStepSize: number): void {
    return this.model.setStepSize(newStepSize);
  }

  public setMinAvailableValue(value: number): void {
    return this.model.setMinAvailableValue(value);
  }

  public setMaxAvailableValue(value: number): void {
    return this.model.setMaxAvailableValue(value);
  }

  private subscribeViewObserver(): void {
    this.view.eventObserver.subscribe((event: ObserverEvent<UnconvertedStateItem>) => {
      switch (event.type) {
        case CustomEvents.HANDLER_WILL_MOUNT:
        case CustomEvents.INTERACTIVE_COMPONENT_CLICKED:
        case CustomEvents.HANDLER_MOUSEMOVE:
          this.model.setState(event.data);
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
        case CustomEvents.GET_ACTUAL_STATE:
          this.view.moveHandler(event.data.state);
          this.view.sliderBody.updateRange();
          break;
        case CustomEvents.MIN_AVAILABLE_VALUE_CHANGED:
        case CustomEvents.MAX_AVAILABLE_VALUE_CHANGED:
        case CustomEvents.STEP_SIZE_CHANGED:
        case CustomEvents.VALUE_TYPE_CHANGED:
        case CustomEvents.AXIS_CHANGED:
          this.view.refreshView();
          this.model.getActualState();
          break;
        case CustomEvents.TOOLTIP_AVAILABILITY_CHANGED:
          this.view.setTooltipAvailability(event.data.withTooltip);
          break;
        case CustomEvents.LABELS_AVAILABILITY_CHANGED:
          this.view.setBreakpointsAvailability();
          break;
        default:
          break;
      }
    });
  }
}

export default Controller;
