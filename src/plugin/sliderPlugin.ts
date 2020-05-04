import View from './components/View/View';
import Model from './components/Model/Model';
import Controller from './components/Controller/Controller';
import Observer from './components/Observer/Observer';

namespace sliderPlugin {
  const model = '';
  jQuery.fn.extend({
    model: null,
    view: null,
    controller: null,

    sliderPlugin () {
      this.model = new Model({
        stepSize: 10,
        tooltip: true,
        axis: 'X',
        showLabels: true,
      });
      this.view = new View(this.model, this);
      this.controller = new Controller(this.model, this.view);

      return this;
    },

    setStepSize (stepSize: number | Array<number>): void {
      this.controller.setStepSize(stepSize);
    }
  });

  export interface jQuery {
    sliderPlugin();
    setStepSize();
  }
}

export default sliderPlugin;