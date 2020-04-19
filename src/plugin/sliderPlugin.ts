import View from './components/View/View';
import Model from './components/Model/Model';
import Controller from './components/Controller/Controller';
import Observer from './components/Observer/Observer';

namespace sliderPlugin {
  jQuery.fn.extend({
    sliderPlugin () {
      const model = new Model({});
      const view = new View(model, this);
      const controller = new Controller(model, view);
    }
  });

  export interface jQuery {
    sliderPlugin();
  }
}

export default sliderPlugin;