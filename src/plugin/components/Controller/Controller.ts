import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';

class Controller {
  private model: Model;
  private view: View;

  constructor (model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.subscribeViewObserver();
    this.subscribeModelObserver();
  }

  public showTooltip (): void {
    this.model.showTooltip();
  }

  public hideTooltip (): void {
    this.model.hideTooltip();
  }

  public setAxis(axis: string) {
    this.model.setAxis(axis);
  }

  public setStepSize (newStepSize: number): void {
    this.model.setStepSize(newStepSize);
  }

  public setMinValue(value: number): void {
    this.model.setMinValue(value);
  }

  public setMaxValue(value: number): void {
    this.model.setMaxValue(value);
  }

  private subscribeViewObserver (): void {
    this.view.eventObserver.subscribe((handlerProps) => {
      this.model.setState(handlerProps);
    })
  }

  private subscribeModelObserver (): void {
    this.model.eventObserver.subscribe((event) => {

      switch (event.name) {
        case 'SET_STATE':
          this.view.prepareToMoveHandler(event.state);
          break;
        case 'SET_MIN_VALUE':
          this.view.drawSliderBreakpoints();
          break;
        case 'SET_MAX_VALUE':
          this.view.drawSliderBreakpoints();
          break;
        case 'SET_STEP_SIZE':
          this.view.drawSliderBreakpoints();
          break;
        case 'SET_AXIS':
          this.view.setAxis(event.axis);
        case 'SET_TOOLTIP_ACTIVE':
          this.view.setTooltipActivity(event.isEnabledTooltip)
        default:
          return;
      }
    })
  }
}

export default Controller;