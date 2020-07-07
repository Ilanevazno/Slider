/* eslint-disable no-unused-expressions */
import '../../../plugin/components/sliderPlugin';
import { AvailableOptions, JqueryPluginElement } from '../../../plugin/components/types/types';

class Panel {
  private sliderOptions: AvailableOptions;

  private $panelHtml: JQuery<HTMLElement>;

  private $slider: JqueryPluginElement;

  private $setTooltipActivity: JQuery<HTMLElement>;

  private $viewTypeSelect: JQuery<HTMLElement>;

  private $valueTypeSelect: JQuery<HTMLElement>;

  private $minValueInput: JQuery<HTMLElement>;

  private $maxValueInput: JQuery<HTMLElement>;

  private $minValueHandlerInput: JQuery<HTMLElement>;

  private $maxValueHandlerInput: JQuery<HTMLElement>;

  private $stepSizeInput: JQuery<HTMLElement>;

  private $setLabelsActivity: JQuery<HTMLElement>;

  private $errorNotify: JQuery<HTMLElement>;

  constructor(htmlContainer: JQuery<HTMLElement> | HTMLElement) {
    this.$panelHtml = $(htmlContainer);
    this.$slider = this.$panelHtml.prev();

    this.sliderOptions = {
      stepSize: this.$slider.data('stepsize'),
      minAvailableValue: this.$slider.data('minavailablevalue'),
      maxAvailableValue: this.$slider.data('maxavailablevalue'),
      minCurrentValue: this.$slider.data('mincurrentvalue'),
      maxCurrentValue: this.$slider.data('maxcurrentvalue'),
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
    try {
      this.$slider.sliderPlugin(this.sliderOptions);
    } catch (error) {
      console.error('Ошибка при создании слайдера!', error);
    }
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
    this.$slider.sliderPlugin('setValueType', this.sliderOptions.valueType);
    this.$slider.sliderPlugin('setAxis', this.sliderOptions.axis);
    this.$valueTypeSelect.val(this.sliderOptions.valueType === 'single' ? 'Одиночное' : 'Интервал');
    this.$viewTypeSelect.val(this.sliderOptions.axis === 'X' ? 'Горизонтальный' : 'Вертикальный');
  }

  private prepareInputLabels(): void {
    const minAvailableValue = this.$slider.sliderPlugin('setMinAvailableValue', this.sliderOptions.minAvailableValue);
    const maxAvailableValue = this.$slider.sliderPlugin('setMaxAvailableValue', this.sliderOptions.maxAvailableValue);

    this.$slider.sliderPlugin('subscribeToChangeState', (newState) => {
      const oldMinValue = this.$minValueHandlerInput?.val();
      const oldMaxValue = this.$maxValueHandlerInput?.val();
      this.$minValueHandlerInput?.val(newState.minValue ?? oldMinValue);
      this.$maxValueHandlerInput?.val(newState.maxValue ?? oldMaxValue);
    });

    this.$stepSizeInput?.val(this.sliderOptions.stepSize);
    this.$minValueInput?.val(this.sliderOptions.minAvailableValue);
    this.$maxValueInput?.val(this.sliderOptions.maxAvailableValue);
  }

  private prepareLabelsData(): void {
    this.$slider.sliderPlugin('setValueType', this.sliderOptions.valueType);
    this.changeViewTypeInputState(this.sliderOptions.valueType);
    this.prepareCheckboxes();
    this.prepareInputLabels();
    this.prepareSelectLabels();
  }

  private changeViewTypeInputState(viewType: string): void {
    const $maxValueInputContainer: JQuery<HTMLElement> = this.$maxValueHandlerInput?.parent();

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
    this.$minValueInput?.on('focusout.minValueInput', this.handleLabelChange.bind(this, 'setMinAvailableValue'));
    this.$maxValueInput?.on('blur.maxValueInput', this.handleLabelChange.bind(this, 'setMaxAvailableValue'));
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
      case 'setMinAvailableValue':
        this.setMinAvailableValue($caughtElement);
        break;
      case 'setMaxAvailableValue':
        this.setMaxAvailableValue($caughtElement);
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

    this.$slider.sliderPlugin('changeStateByItemName', 'minValue', newStateValue);
  }

  private setMaxValueHandler($targetLabel: JQuery<HTMLElement>): void {
    const newStateValue = $targetLabel.val();

    this.$slider.sliderPlugin('changeStateByItemName', 'maxValue', newStateValue);
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
    $targetLabel.is(':checked')
      ? this.$slider.sliderPlugin('setLabelsActivity', true)
      : this.$slider.sliderPlugin('setLabelsActivity', false);
  }

  private setStepSize($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    try {
      this.$slider.sliderPlugin('setStepSize', caughtNewValue);
    } catch (error) {
      this.getErrorNotify(error.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setMinAvailableValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    try {
      this.$slider.sliderPlugin('setMinAvailableValue', caughtNewValue);
    } catch (error) {
      this.getErrorNotify(error.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setMaxAvailableValue($targetLabel: JQuery<HTMLElement>): void {
    const caughtNewValue = Number($targetLabel.val());
    const $targetLabelParent = $targetLabel.parent();
    try {
      this.$slider.sliderPlugin('setMaxAvailableValue', caughtNewValue);
    } catch (error) {
      this.getErrorNotify(error.message, $targetLabelParent);
      $targetLabel.val('');
    }
  }

  private setActivityTooltip($targetLabel: JQuery<HTMLElement>): void {
    $targetLabel.is(':checked')
      ? this.$slider.sliderPlugin('setTooltipActivity', true)
      : this.$slider.sliderPlugin('setTooltipActivity', false);
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
