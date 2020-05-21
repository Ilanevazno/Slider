import Model from '../Model/Model';
import MainView from '../View/MainView';
import Observer from '../Observer/Observer';
import * as customEvent from '../Observer/customEvents';
import { observerEvent, modelListener } from '../types/types';

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

  public subscribeToChangeState(): void {
    return this.model.eventObserver.subscribe((event: observerEvent<modelListener>) => {
      switch (event.type) {
        case customEvent.setState:
          this.eventObserver.broadcast({ type: customEvent.setState, data: { state: event.data.state } });
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

  public setStepSize(newStepSize: number): object {
    return this.model.setStepSize(newStepSize);
  }

  public setMinValue(value: number): object {
    return this.model.setMinValue(value);
  }

  public setMaxValue(value: number): object {
    return this.model.setMaxValue(value);
  }

  private subscribeViewObserver(): void {
    this.view.eventObserver.subscribe((event: observerEvent<never>) => {
      switch (event.type) {
        case customEvent.setState:
          this.model.setState(event.data);
          break;
        case customEvent.refreshState:
          this.model.refreshState();
          break;
        case customEvent.clearState:
          this.model.clearState();
          break;
        default:
          break;
      }
    });
  }

  private subscribeModelObserver(): void {
    this.model.eventObserver.subscribe((event: observerEvent<modelListener>) => {
      switch (event.type) {
        case customEvent.setState:
          this.view.prepareToMoveHandler(event.data.state);
          break;
        case customEvent.setValueType:
          this.view.refreshView();
          break;
        case customEvent.setMinValue:
          this.view.changeBreakpointsActivity();
          break;
        case customEvent.setMaxValue:
          this.view.changeBreakpointsActivity();
          break;
        case customEvent.setStepSize:
          this.view.changeBreakpointsActivity();
          break;
        case customEvent.setAxis:
          this.view.changeSliderBodyAxis(event.data.axis);
          break;
        case customEvent.setTooltipActivity:
          this.view.setTooltipActivity(event.data.isEnabledTooltip);
          break;
        case customEvent.setLabelsActivity:
          this.view.changeBreakpointsActivity();
          break;
        default:
      }
    });
  }
}

export default Controller;
