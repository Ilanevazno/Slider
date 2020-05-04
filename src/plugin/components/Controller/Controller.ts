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

  public setStepSize (newStepSize: number): void {
    this.model.setStepSize(newStepSize);
  }

  private subscribeViewObserver (): void {
    this.view.eventObserver.subscribe((handlerProps) => {
      this.model.setState(handlerProps);
    })
  }

  private subscribeModelObserver (): void {
    this.model.eventObserver.subscribe((event) => {
      this.view.prepareToMoveHandler(event.state)
    })
  }
}

export default Controller;