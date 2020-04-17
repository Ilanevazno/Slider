class SliderHandler {
  private $sliderHandler: JQuery<HTMLElement> | null;
  constructor() {
    this.$sliderHandler = null;
  }

  public initComponent (domElement: HTMLElement | JQuery<HTMLElement>): void {
    this.$sliderHandler = $('<div/>', {
      class: 'slider__handler'
    }).appendTo(domElement);

    this.$sliderHandler.on('click', this.handleHandlerClick);
  }

  public handleHandlerClick (): void {
    console.log('hadfgag')
  }
}

export default SliderHandler;