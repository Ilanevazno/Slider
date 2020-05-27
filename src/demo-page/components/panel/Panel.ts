/* eslint-disable no-unused-expressions */
import '../../../plugin/components/sliderPlugin';
import { availableOptions } from '../../../plugin/components/types/types';

type panelDOMElement = JQuery<HTMLElement> | undefined;

interface SliderMethods{
  sliderPlugin: void;
}

class Panel {
  private sliderOptions: availableOptions;

  private $panelHtml: JQuery<HTMLElement>;

  private $slider: any;

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
    this.$slider = this.$panelHtml.prev();

    this.sliderOptions = {
      stepSize: this.$slider.data('stepsize'),
      minValue: this.$slider.data('minvalue'),
      maxValue: this.$slider.data('maxvalue'),
      valueType: this.$slider.data('valuetype'),
      axis: this.$slider.data('axis'),
      withTooltip: this.$slider.data('withtooltip') !== undefined,
      withLabels: this.$slider.data('withlabels') !== undefined,
    };

    this.drawSlider();
    this.connectLabels();
    this.initEvents();
  }

  private drawSlider(): void {
    this.$slider.sliderPlugin(this.sliderOptions);
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

  private prepareCheckboxes(): void {
    if (this.sliderOptions.withTooltip) {
      this.$setTooltipActivity?.prop('checked', true);
    }

    if (this.sliderOptions.withLabels) {
      this.$setLabelsActivity?.prop('checked', true);
    }
  }

  private prepareSelectLabels(): void {
    const currentValueType = this.sliderOptions.valueType === 'single'
      ? 'Одиночное'
      : 'Интервал';

    this.$valueTypeSelect.val(currentValueType);

    const currentAxis = this.sliderOptions.axis === 'X'
      ? 'Горизонтальный'
      : 'Вертикальный';

    this.$viewTypeSelect.val(currentAxis);
  }

  private prepareInputLabels(): void {
    this.$slider.sliderPlugin('subscribeToChangeState', (newState) => {
      try {
        this.$minValueHandlerInput?.val(newState[0].value);
        this.$maxValueHandlerInput?.val(newState[Object.values(newState).length - 1].value);
        // eslint-disable-next-line no-empty
      } catch (err) { }
    });

    this.$stepSizeInput?.val(this.sliderOptions.stepSize);
    this.$minValueInput?.val(this.sliderOptions.minValue);
    this.$maxValueInput?.val(this.sliderOptions.maxValue);
  }

  private prepareLabelsData(): void {
    this.changeViewTypeInputState(this.sliderOptions.valueType);
    this.prepareCheckboxes();
    this.prepareInputLabels();
    this.prepareSelectLabels();
  }

  private changeViewTypeInputState(viewType: string): void {
    const $maxValueInputContainer: panelDOMElement = this.$maxValueHandlerInput?.parent();

    if (viewType === 'single') {
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
    const errorSound = new Audio('src/demo-page/assets/sounds/sound__error.mp3');

    errorSound.play();

    this.$errorNotify = $('<div/>', {
      class: 'panel__modal_type_error',
      text: errorMessage,
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
        break;
      case 'setLabelsActivity':
        this.setLabelsActivity($caughtElement);
        break;
      case 'changeAxis':
        this.changeAxis($caughtElement);
        break;
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
        break;
      default:
        break;
    }
  }

  private setMinValueHandler($targetLabel: JQuery<HTMLElement>): void {
    const newStateValue = $targetLabel.val();

    this.$slider.sliderPlugin('changeStateByHandlerName', 'min-value', newStateValue);
  }

  private setMaxValueHandler($targetLabel: JQuery<HTMLElement>): void {
    const newStateValue = $targetLabel.val();

    this.$slider.sliderPlugin('changeStateByHandlerName', 'max-value', newStateValue);
  }

  private changeValueType($targetLabel: JQuery<HTMLElement>): void {
    const $options: JQuery<HTMLElement> = $targetLabel.find('.js-panel__label-item-option');
    const selectedOption = $targetLabel.val();

    $options.each((_idx, item) => {
      const $currentOptionElement = $(item);
      const currentElementText = $currentOptionElement.text();

      if (selectedOption === currentElementText) {
        const caughtValueType = $currentOptionElement.data('code');

        this.$slider.sliderPlugin('setValueType', caughtValueType);
        this.changeViewTypeInputState(caughtValueType);
      }
    });
  }

  private setLabelsActivity($targetLabel: JQuery<HTMLElement>): void {
    $targetLabel.is(':checked') ? this.$slider.sliderPlugin('showLabels') : this.$slider.sliderPlugin('hideLabels');
  }

  private setStepSize($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    const setStepSizeRequest = this.$slider.sliderPlugin('setStepSize', caughtNewValue);

    if (setStepSizeRequest.response === 'ERROR') {
      this.getErrorNotify(setStepSizeRequest.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setMinValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    const setNewValueRequest = this.$slider.sliderPlugin('setMinValue', caughtNewValue);

    if (setNewValueRequest.response === 'ERROR') {
      this.getErrorNotify(setNewValueRequest.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setMaxValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    const setMaxValueRequest = this.$slider.sliderPlugin('setMaxValue', caughtNewValue);

    if (setMaxValueRequest.response === 'ERROR') {
      this.getErrorNotify(setMaxValueRequest.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setActivityTooltip($targetLabel: JQuery<HTMLElement>): void {
    $targetLabel.is(':checked') ? this.$slider.sliderPlugin('showTooltip') : this.$slider.sliderPlugin('hideTooltip');
  }

  private changeAxis($targetLabel: JQuery<HTMLElement>): void {
    const selectedOption = $targetLabel.val();
    const $options: JQuery<HTMLElement> = $targetLabel.find('.js-panel__label-item-option');

    $options.each((_idx, item) => {
      const $currentOptionElement = $(item);
      const currentElementText = $currentOptionElement.text();

      if (selectedOption === currentElementText) {
        const newAxis = $currentOptionElement.data('code');
        this.$slider.sliderPlugin('setAxis', newAxis);
      }
    });
  }
}
export default Panel;
