import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';

class Controller {
  private model: Model;
  private view: View;

  constructor (model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.subscribeViewObserver ();
  }

  public setStepSize (newStepSize: number): void {
    this.model.setStepSize(newStepSize);
  }

  private subscribeViewObserver () {
    this.view.eventObserver.subscribe(handlerPosition => {
      this.model.setState(handlerPosition);
      this.listenToChangeState();
    })
  }

  private listenToChangeState () {
    const currentState: object = this.model.getState();
    this.view.validateNewHandlerPosition(currentState)
  }
}

export default Controller;