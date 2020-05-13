import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';
import * as customEvent from '../Observer/customEvents';

class Controller {
  private model: Model;
  private view: View;
  private eventObserver: Observer;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.eventObserver = new Observer();

    this.subscribeViewObserver();
    this.subscribeModelObserver();
  }

  public subscribeToChangeState(): any {
    return this.model.eventObserver.subscribe((event) => {
      if (event.name === customEvent.setState) {
        this.eventObserver.broadcast({ type: customEvent.setState, state: event.state });
      }
    });
  }

  public changeHandlerState(handlerName: string, value: number):void {
    this.model.changeStateByName(handlerName, value);
  }

  public setValueType(valueType): void {
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

  public setMinValue(value: number): void | object {
    return this.model.setMinValue(value);
  }

  public setMaxValue(value: number): object {
    return this.model.setMaxValue(value);
  }

  private subscribeViewObserver(): void {
    this.view.eventObserver.subscribe((event) => {
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
    })
  }

  private subscribeModelObserver(): void {
    this.model.eventObserver.subscribe((event) => {
      switch (event.name) {
        case customEvent.setState:
          this.view.prepareToMoveHandler(event.state);
          break;
        case customEvent.setValueType:
          this.view.refreshView();
          break
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
          this.view.setAxis(event.axis);
          break;
        case customEvent.setTooltipActivity:
          this.view.setTooltipActivity(event.isEnabledTooltip);
          break;
        case customEvent.setLabelsActivity:
          this.view.changeBreakpointsActivity();
          break;
        default:
          return;
      }
    })
  }
}

export default Controller;