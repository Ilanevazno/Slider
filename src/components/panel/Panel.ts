type sliderOptions = {
  stepSize: number,
  minValue: number,
  maxValue: number,
  axis: string,
  isEnabledTooltip: boolean,
  isShowLabels: boolean,
  valueType: string;
}

type panelDOMElement = JQuery<HTMLElement> | undefined;

class Panel {
  private sliderOptions: sliderOptions;
  private $panelHtml: JQuery<HTMLElement>;
  private slider: any;
  private $setTooltipActivity: panelDOMElement;
  private $viewTypeSelect: panelDOMElement;
  private $valueTypeSelect: panelDOMElement;
  private $minValueInput: panelDOMElement;
  private $maxValueInput: panelDOMElement;
  private $minValueHandlerInput: panelDOMElement;
  private $maxValueHandlerInput: panelDOMElement;
  private $stepSizeInput: panelDOMElement;
  private $setLabelsActivity: panelDOMElement;
  private $errorNotify: panelDOMElement;

  constructor(htmlContainer: JQuery<HTMLElement> | HTMLElement) {
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

  private drawSlider(): void {
    this.slider = this.slider.sliderPlugin(this.sliderOptions);
  }

  private connectLabels(): void {
    this.$setTooltipActivity = this.$panelHtml.find('[name=tooltip]');
    this.$viewTypeSelect = this.$panelHtml.find('[name=view-type]');
    this.$valueTypeSelect = this.$panelHtml.find('[name=value-type]');
    this.$minValueInput = this.$panelHtml.find('[name=min-value]');
    this.$maxValueInput = this.$panelHtml.find('[name=max-value]');
    this.$setLabelsActivity = this.$panelHtml.find('[name=labels-activity]');
    this.$stepSizeInput = this.$panelHtml.find('[name=step-size]');
    this.$minValueHandlerInput = this.$panelHtml.find('[name=min-value-handler]');
    this.$maxValueHandlerInput = this.$panelHtml.find('[name=max-value-handler]');

    this.prepareLabelsData();
  }

  private prepareLabelsData(): void {
    if (this.sliderOptions.isEnabledTooltip) {
      this.$setTooltipActivity?.prop('checked', true);
    }

    if (this.sliderOptions.isShowLabels) {
      this.$setLabelsActivity?.prop('checked', true);
    }

    this.changeViewTypeInputState(this.sliderOptions.valueType);

    this.slider.listenToChangeState((newState) => {
      try {
        this.$minValueHandlerInput?.val(newState[0].value);
        this.$maxValueHandlerInput?.val(newState[Object.values(newState).length - 1].value);
      } catch (err) { }
    });

    this.$stepSizeInput?.val(this.sliderOptions.stepSize);
    this.$minValueInput?.val(this.sliderOptions.minValue);
    this.$maxValueInput?.val(this.sliderOptions.maxValue);
  }

  private changeViewTypeInputState(viewType: string): void {
    const $maxValueInputContainer: panelDOMElement = this.$maxValueHandlerInput?.parent();

    if (viewType === 'singleValue') {
      $maxValueInputContainer?.hide();
    } else {
      $maxValueInputContainer?.show();
    }
  }

  private initEvents() {
    $(document).on('mousedown.documentMousedown', this.handleDocumentMouseDown.bind(this));
    this.$setTooltipActivity?.on('change.tooltipActivity', this.handleLabelChange.bind(this, 'setTooltipActivity'));
    this.$setLabelsActivity?.on('change.labelsActivity', this.handleLabelChange.bind(this, 'setLabelsActivity'));
    this.$viewTypeSelect?.on('change.viewTypeSelect', this.handleLabelChange.bind(this, 'changeAxis'));
    this.$valueTypeSelect?.on('change.ValueTypeSelect', this.handleLabelChange.bind(this, 'changeValueType'));
    this.$minValueInput?.on('focusout.minValueInput', this.handleLabelChange.bind(this, 'setMinValue'));
    this.$maxValueInput?.on('blur.maxValueInput', this.handleLabelChange.bind(this, 'setMaxValue'));
    this.$stepSizeInput?.on('blur.stepSizeInput', this.handleLabelChange.bind(this, 'setStepSize'));
    this.$minValueHandlerInput?.on('blur.minValueHandlerInput', this.handleLabelChange.bind(this, 'setMinValueHandler'));
    this.$maxValueHandlerInput?.on('blur.maxValueHandlerInput', this.handleLabelChange.bind(this, 'setMaxValueHandler'));
  }

  private getErrorNotify(errorMessage: string, $label: JQuery<HTMLElement>): void {
    const errorSound = new Audio('src/assets/sounds/sound__error.mp3');

    errorSound.play();

    this.$errorNotify = $('<div/>', {
      class: 'panel__modal_type_error',
      text: errorMessage
    }).appendTo($label);
  }

  private handleDocumentMouseDown(): void {
    this.$errorNotify?.remove();
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
      case 'setMinValueHandler':
        this.setMinValueHandler($caughtElement);
        break;
      case 'setMaxValueHandler':
        this.setMaxValueHandler($caughtElement);
        break
      default:
        break
    }
  }

  private setMinValueHandler($targetLabel: JQuery<HTMLElement>): void {
    const newStateValue = $targetLabel.val();

    this.slider.changeStateByHandlerName('min-value', newStateValue);
  }

  private setMaxValueHandler($targetLabel: JQuery<HTMLElement>): void {
    const newStateValue = $targetLabel.val();

    this.slider.changeStateByHandlerName('max-value', newStateValue);
  }

  private changeValueType($targetLabel: JQuery<HTMLElement>): void {
    const $options: JQuery<HTMLElement> = $targetLabel.find('.js-panel__label-item-option');
    const selectedOption = $targetLabel.val();

    $options.each((_idx, item) => {
      const $currentOptionElement = $(item);
      const currentElementText = $currentOptionElement.text();

      if (selectedOption === currentElementText) {
        const caughtValueType = $currentOptionElement.data('code');

        this.slider.setValueType(caughtValueType);
        this.changeViewTypeInputState(caughtValueType);
      }
    });
  }

  private setLabelsActivity($targetLabel: JQuery<HTMLElement>): void {
    $targetLabel.is(':checked') ? this.slider.showLabels() : this.slider.hideLabels();
  }

  private setStepSize($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue: number = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    const setStepSizeRequest = this.slider.setStepSize(caughtNewValue);

    if (setStepSizeRequest.response === 'error') {
      this.getErrorNotify(setStepSizeRequest.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setMinValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue: number = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    const setNewValueRequest = this.slider.setMinValue(caughtNewValue);

    if (setNewValueRequest.response === 'error') {
      this.getErrorNotify(setNewValueRequest.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setMaxValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue: number = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    const setMaxValueRequest = this.slider.setMaxValue(caughtNewValue);

    if (setMaxValueRequest.response === 'error') {
      this.getErrorNotify(setMaxValueRequest.message, $targetLabelParent);
      $targetLabel.val('');
    }
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