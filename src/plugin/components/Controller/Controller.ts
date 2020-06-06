import Model from '../Model/Model';
import MainView from '../View/MainView';
import Observer from '../Observer/Observer';
import СustomEvents from '../Observer/CustomEvents';
import {
  ObserverEvent, ModelListener, StateHandler, ModelResponse,
} from '../types/types';

class Controller {
  private model: Model;

  private view: MainView;

  private eventObserver: Observer;

  constructor(model: Model, view: MainView) {
    this.model = model;
    this.view = view;
    this.eventObserver = new Observer();

    this.subscribeViewObserver();
    this.subscribeModelObserver();
  }

  public subscribeToChangeState(callback): void {
    return this.model.eventObserver.subscribe((event: ObserverEvent<ModelListener>) => {
      switch (event.type) {
        case СustomEvents.SetState:
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

  public setValueType(valueType: string): void {
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

  public setAxis(axis: string) {
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
    this.view.eventObserver.subscribe((event: ObserverEvent<StateHandler>) => {
      switch (event.type) {
        case СustomEvents.SetState:
          this.model.setState(event.data);
          break;
        case СustomEvents.RefreshState:
          this.model.refreshState();
          break;
        case СustomEvents.ClearState:
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
        case СustomEvents.SetState:
          this.view.prepareToMoveHandler(event.data.state);
          break;
        case СustomEvents.SetValueType:
          this.view.refreshView();
          break;
        case СustomEvents.SetMinValue:
        case СustomEvents.SetMaxValue:
        case СustomEvents.SetStepSize:
          this.view.changeBreakpointsActivity();
          break;
        case СustomEvents.SetAxis:
          this.view.changeSliderBodyAxis(event.data.axis);
          break;
        case СustomEvents.SetTooltipActivity:
          this.view.setTooltipActivity(event.data.withTooltip);
          break;
        case СustomEvents.SetLabelsActivity:
          this.view.changeBreakpointsActivity();
          break;
        default:
          break;
      }
    });
  }
}

export default Controller;
