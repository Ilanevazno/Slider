type sliderOptions = {
  stepSize: number,
  minValue: number,
  maxValue: number,
  axis: string,
  isEnabledTooltip: boolean,
  isShowLabels: boolean,
  valueType: string;
}

class Panel {
  private sliderOptions: sliderOptions;
  private $panelHtml: any;
  private slider: any;
  private $setTooltipActivity: JQuery<HTMLElement> | undefined;
  private $viewTypeSelect: JQuery<HTMLElement> | undefined;
  private $valueTypeSelect: JQuery<HTMLElement> | undefined;
  private $minValueInput: JQuery<HTMLElement> | undefined;
  private $maxValueInput: JQuery<HTMLElement> | undefined;
  private $stepSizeInput: JQuery<HTMLElement> | undefined;
  private $setLabelsActivity: JQuery<HTMLElement> | undefined;

  constructor(htmlContainer) {
    this.$panelHtml = $(htmlContainer);
    this.slider = this.$panelHtml.prev();

    this.sliderOptions = {
      stepSize: this.slider.data('stepsize'),
      minValue: this.slider.data('minvalue'),
      maxValue: this.slider.data('maxvalue'),
      valueType: this.slider.data('valuetype'),
      axis: this.slider.data('axis'),
      isEnabledTooltip: this.slider.data('isshowtooltip') !== undefined,
      isShowLabels: this.slider.data('isshowlabels') !== undefined,
    };

    this.drawSlider();
    this.connectLabels();
    this.initEvents();
  }

  private drawSlider() {
    this.slider = this.slider.sliderPlugin(this.sliderOptions);
  }

  private connectLabels() {
    this.$setTooltipActivity = this.$panelHtml.find('[name=tooltip]');
    this.$viewTypeSelect = this.$panelHtml.find('[name=view-type]');
    this.$valueTypeSelect = this.$panelHtml.find('[name=value-type]');
    this.$minValueInput = this.$panelHtml.find('[name=min-value]');
    this.$maxValueInput = this.$panelHtml.find('[name=max-value]');
    this.$setLabelsActivity = this.$panelHtml.find('[name=labels-activity]');
    this.$stepSizeInput = this.$panelHtml.find('[name=step-size]');

    this.prepareLabelsData();
  }

  private prepareLabelsData(): void {
    if (this.sliderOptions.isEnabledTooltip) {
      this.$setTooltipActivity?.prop('checked', true);
    }

    if (this.sliderOptions.isShowLabels) {
      this.$setLabelsActivity?.prop('checked', true);
    }

    this.$stepSizeInput?.val(this.sliderOptions.stepSize);
    this.$minValueInput?.val(this.sliderOptions.minValue);
    this.$maxValueInput?.val(this.sliderOptions.maxValue);
  }

  private initEvents() {
    this.$setTooltipActivity?.on('change', this.handleLabelChange.bind(this, 'setTooltipActivity'));
    this.$setLabelsActivity?.on('change', this.handleLabelChange.bind(this, 'setLabelsActivity'));
    this.$viewTypeSelect?.on('change', this.handleLabelChange.bind(this, 'changeAxis'));
    this.$valueTypeSelect?.on('change', this.handleLabelChange.bind(this, 'changeValueType'));
    this.$minValueInput?.on('focusout', this.handleLabelChange.bind(this, 'setMinValue'));
    this.$maxValueInput?.on('blur', this.handleLabelChange.bind(this, 'setMaxValue'));
    this.$stepSizeInput?.on('blur', this.handleLabelChange.bind(this, 'setStepSize'))
  }

  private handleLabelChange(target, event) {
    const $caughtElement: JQuery<HTMLElement> = $(event.target);

    switch (target) {
      case 'setTooltipActivity':
        this.setActivityTooltip($caughtElement);
        break
      case 'setLabelsActivity':
        this.setLabelsActivity($caughtElement);
        break;
      case 'changeAxis':
        this.changeAxis($caughtElement);
        break
      case 'changeValueType':
        this.changeValueType($caughtElement);
        break;
      case 'setMinValue':
        this.setMinValue($caughtElement);
        break;
      case 'setMaxValue':
        this.setMaxValue($caughtElement);
        break;
      case 'setStepSize':
        this.setStepSize($caughtElement);
        break;
      default:
        break
    }
  }

  private changeValueType ($targetLabel: JQuery<HTMLElement>): void {
    const $options: JQuery<HTMLElement> = $targetLabel.find('.js-panel__label-item-option');
    const selectedOption = $targetLabel.val();

    $options.each((_idx, item) => {
      const $currentOptionElement = $(item);
      const currentElementText = $currentOptionElement.text();

      if (selectedOption === currentElementText) {
        const caughtValueType = $currentOptionElement.data('code');
        this.slider.setValueType(caughtValueType);
      }
    });
  }

  private setLabelsActivity($targetLabel: JQuery<HTMLElement>): void {
    $targetLabel.is(':checked') ? this.slider.showLabels() : this.slider.hideLabels();
  }

  private setStepSize($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue: number = Number($targetLabel.val());
    this.slider.setStepSize(caughtNewValue);
  }

  private setMinValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue: number = Number($targetLabel.val());
    this.slider.setMinValue(caughtNewValue);
  }

  private setMaxValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue: number = Number($targetLabel.val());
    this.slider.setMaxValue(caughtNewValue);
  }

  private setActivityTooltip($targetLabel: JQuery<HTMLElement>): void {
    $targetLabel.is(':checked') ? this.slider.showTooltip() : this.slider.hideTooltip();
  }

  private changeAxis($targetLabel: JQuery<HTMLElement>): void {
    const selectedOption = $targetLabel.val();
    const $options: JQuery<HTMLElement> = $targetLabel.find('.js-panel__label-item-option');

    $options.each((_idx, item) => {
      const $currentOptionElement = $(item);
      const currentElementText = $currentOptionElement.text();

      if (selectedOption === currentElementText) {
        const newAxis = $currentOptionElement.data('code');
        this.slider.setAxis(newAxis);
      }
    });
  }
}
export default Panel;