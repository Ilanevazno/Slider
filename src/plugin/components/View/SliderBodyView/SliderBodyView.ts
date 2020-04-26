class SliderBodyView {
  public $htmlContainer: JQuery<HTMLElement>;

  constructor ($htmlContainer: JQuery<HTMLElement>) {
    this.$htmlContainer = this.drawSliderBody($htmlContainer);
  }

  private drawSliderBody($htmlContainer): JQuery<HTMLElement> {
    const sliderBody: JQuery<HTMLElement> = $('<div/>', {
      class: 'slider__body'
    }).appendTo($htmlContainer);

    return sliderBody;
  }
}

export default SliderBodyView;