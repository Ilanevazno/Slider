import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';

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
      if (event.name === 'SET_STATE') {
        this.eventObserver.broadcast({ type: 'SET_STATE', state: event.state });
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
        case 'SET_STATE':
          this.model.setState(event.data);
          break;
        case 'REFRESH_STATE':
          this.model.refreshState();
          break;
        case 'CLEAR_STATE':
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
        case 'SET_STATE':
          this.view.prepareToMoveHandler(event.state);
          break;
        case 'SET_VALUE_TYPE':
          this.view.refreshView();
          break
        case 'SET_MIN_VALUE':
          this.view.changeBreakpointsActivity();
          break;
        case 'SET_MAX_VALUE':
          this.view.changeBreakpointsActivity();
          break;
        case 'SET_STEP_SIZE':
          this.view.changeBreakpointsActivity();
          break;
        case 'SET_AXIS':
          this.view.setAxis(event.axis);
          break;
        case 'SET_TOOLTIP_ACTIVITY':
          this.view.setTooltipActivity(event.isEnabledTooltip);
          break;
        case 'SET_LABELS_ACTIVITY':
          this.view.changeBreakpointsActivity();
          break;
        default:
          return;
      }
    })
  }
}

export default Controller;