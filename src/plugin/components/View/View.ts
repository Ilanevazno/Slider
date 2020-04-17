import SliderBody from './SliderBody/SliderBody';
import SliderHandler from './SliderHandler/SliderHandler';
import Model from '../Model/Model';

class View {
  private sliderBody: SliderBody;
  private sliderHandler: SliderHandler;

  constructor(private model: Model, initHTMLContainer: HTMLElement) {
    this.sliderBody = new SliderBody();
    this.sliderHandler = new SliderHandler()

    this.initDOMComponents(initHTMLContainer);
  }

  initDOMComponents(initHTMLContainer): void {
    const sliderBody = this.sliderBody.initComponent(initHTMLContainer);
    this.sliderHandler.initComponent(sliderBody);
  }

}

export default View;