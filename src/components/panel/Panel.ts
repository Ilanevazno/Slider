class Panel {
  private $panelHtml: any;
  private slider: any;
  private $isShowLabelCheckbox: JQuery<HTMLElement> | undefined;

  constructor(htmlContainer) {
    this.$panelHtml = $(htmlContainer);
    this.slider = this.$panelHtml.prev();

    this.drawSlider();
    this.connectLabels();
    this.initEvents();
  }

  private drawSlider() {
    this.slider = this.slider.sliderPlugin({
      stepSize: 10,
      minValue: 0,
      maxValue: 100,
      axis: 'X',
    });
  }

  private connectLabels() {
    this.$isShowLabelCheckbox = this.$panelHtml.find('[name=tooltip]');
    // console.log(this.$isShowLabelCheckbox);
  }

  private initEvents() {
    this.$isShowLabelCheckbox?.on('change', this.handleLabelChange.bind(this));
  }

  private handleLabelChange(event) {
    const $caughtElement = $(event.target);
    if ($caughtElement.is(':checked')) {
      this.slider.showTooltip();
    } else {
      this.slider.hideTooltip();
    }
  }
}

export default Panel;