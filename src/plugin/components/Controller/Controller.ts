import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';

class Controller {
  private model: Model;
  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.subscribeViewObserver();
    this.subscribeModelObserver();
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

  public setStepSize(newStepSize: number): void {
    this.model.setStepSize(newStepSize);
  }

  public setMinValue(value: number): void {
    this.model.setMinValue(value);
  }

  public setMaxValue(value: number): void {
    this.model.setMaxValue(value);
  }

  private subscribeViewObserver(): void {
    this.view.eventObserver.subscribe((event) => {
      // console.log(event);
      switch (event.type) {
        case 'SET_STATE':
          this.model.setState(event.data);
          break;
        case 'REFRESH_STATE':
          this.model.refreshState();
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
        case 'SET_TOOLTIP_ACTIVE':
          this.view.setTooltipActivity(event.isEnabledTooltip)
        case 'SET_LABELS_ACTIVITY':
          this.view.changeBreakpointsActivity();
        default:
          return;
      }
    })
  }
}

export default Controller;