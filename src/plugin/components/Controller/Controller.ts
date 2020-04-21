import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';

class Controller {
  private model: Model;
  private view: View;
  private observer: Observer;

  constructor (model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.observer = new Observer();

    this.subscribeViewObserver ();
  }

  private subscribeViewObserver () {
    this.view.eventObserver.subscribe(handlerPosition => {
      this.model.setState(handlerPosition);

      this.listenToChangeState();
    })

    this.view.initEvents ();
  }

  public setStepSize (newStepSize: number): void {
    this.model.setStepSize(newStepSize);
  }

  private listenToChangeState () {
    const currentState: object = this.model.getState();

    this.view.validateNewHandlerPosition(currentState['newHandlerPercent'])
  }
}

export default Controller;