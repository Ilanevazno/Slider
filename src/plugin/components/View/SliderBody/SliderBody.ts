class SliderBody {
  public sliderBody: JQuery<HTMLElement> | null;

  constructor() {
    this.sliderBody = null;
  }

  public initComponent (domElement: HTMLElement): JQuery<HTMLElement> {
    this.sliderBody = $('<div/>', {
      class: 'slider'
    }).appendTo(domElement);

    return this.sliderBody;
  }

  public bindActions (): void {

  }
}

export default SliderBody;