import { SettingsPanel } from '../Panel/Panel';

export class Controller {
  observer: any

  model: any;

  view: any;

  panel: any;

  constructor(model, view, observer) {
    this.model = model;
    this.view = view;
    this.observer = observer;
  }

  private sliderParams: number | null = 0;

  private pointerPosition: any = 0;

  public targetedPointer: any;

  private minValue: any;

  private maxValue: any;

  public sliderType: valueCount = 'singleValue';

  public sliderExemplar: any;

  private activeDirection!: string;

  setMinValue(value: number) {
    this.model.valueFrom = value;
  }

  public setMaxValue(value: number) {
    this.model.valueTo = value;
  }

  public setStepSize(size: number) {
    this.model.pointerStepSize = size;
  }

  public setViewType(viewType: string): void {
    this.view.viewType = viewType;
    this.view.viewType === 'horizontal' ? this.activeDirection = 'left' : this.activeDirection = 'top';
  }

  public getValueIndicator(data) {
    if (data === false) {
      return null;
    }
    return this.view.getValueIndicator(data);
  }

  public setSliderType(sliderType: valueCount): void {
    this.sliderType = sliderType;
  }

  public generateSlider(exemplar: JQuery<HTMLElement>): void{
    this.sliderExemplar = exemplar;
    this.view.renderSlider(exemplar, this.model.getPointerCount(this.sliderType));
    this.AccessToDragging();
  }

  public getPointerPosition(sliderBody, sliderViewType, shift, target) {
    if (sliderViewType === 'horizontal') {
      const position: number = target.clientX - shift - sliderBody.getBoundingClientRect().left;
      return position;
    } if (sliderViewType === 'vertical') {
      const position: number = target.clientY - shift - sliderBody.getBoundingClientRect().top;
      return position;
    }
    return null;
  }

  private initState() {
    this.sliderParams = this.getSliderParams(this.view.sliderBodyHtml, this.view.viewType);
    this.model.state = this.model.initState({
      sliderViewType: this.view.viewType,
      sliderWidth: this.sliderParams,
      pointerList: this.view.pointerList,
    });
  }

  private renderTrackLine() {
    const startVal = this.model.PercentToPx(this.sliderParams, this.minValue.pointerValue);
    const endVal = this.model.PercentToPx(this.sliderParams, this.maxValue.pointerValue);
    for (let i = 0; i < this.model.state.length; i++) {
      switch (this.sliderType) {
        case 'singleValue':
          if (this.view.viewType === 'horizontal') {
            this.view.trackLine.width(`${this.pointerPosition}px`);
          } else if (this.view.viewType === 'vertical') {
            this.view.trackLine.width('100%');
            this.view.trackLine.height(`${this.pointerPosition}px`);
          }
          break;
        case 'doubleValue':
          if (this.view.viewType === 'horizontal') {
            this.view.trackLine.width(`${endVal - startVal}px`);
            $(this.view.trackLine).css({ left: `${startVal}px` });
          } else if (this.view.viewType === 'vertical') {
            this.view.trackLine.width('100%');
            $(this.view.trackLine).css({ top: `${startVal}px` });
            this.view.trackLine.height(`${endVal - startVal}px`);
          }
          break;
        default:
          alert('Ошибка в TrackLine');
          console.log('Ошибка в методе renderTrackLine');
      }
    }
  }

  public AccessToDragging(): void {
    this.initState();

    // if sliderType == double, then we getting 2 variables with min and max values
    if (this.sliderType === 'doubleValue') {
      this.minValue = this.model.state[0];
      this.maxValue = this.model.state[Object.keys(this.model.state).length - 1];
    }

    for (let i = 0; i < this.model.state.length; i++) {
      const element = this.model.state[i].pointerItem;
      $(element).on('mousedown', (e: any) => {
        e.preventDefault();

        this.targetedPointer = e.currentTarget;

        const shiftDirection = this.getShiftВirection(this.view.viewType, e, element);
        this.prepareForUsing(shiftDirection);
      });
    }

    this.model.observer.subscribe((data) => {
      for (let i = 0; i < this.model.state.length; i++) {
        this.renderTrackLine();
        // set each pointer statement value
        $(this.model.state[i].pointerItem).children(`span.${this.model.classList.valueClass}`).text(this.model.state[i].pointerValue);
      }
      return data;
    });
  }

  private getSliderParams(sliderBody, sliderViewType) {
    const sliderPointer = sliderBody.children().eq(0)[0];
    let sliderData: number | null = null;

    if (sliderViewType === 'horizontal') {
      sliderData = sliderBody[0].offsetWidth - sliderPointer.offsetWidth;
    } else if (sliderViewType === 'vertical') {
      sliderData = sliderBody[0].offsetHeight - sliderPointer.offsetWidth;
    }
    return sliderData;
  }

  private getNthPointer(eq: number) {
    return $(this.model.state[eq].pointerItem);
  }

  public getShiftВirection(viewType, event, element) {
    let shift: number | null = null;
    if (viewType === 'horizontal') {
      shift = event.clientX - $(element)[0].getBoundingClientRect().left;
    } else if (viewType === 'vertical') {
      shift = event.clientY - $(element)[0].getBoundingClientRect().top;
    }

    return shift;
  }

  public prepareForUsing(shift: number): void {
    $(document).on('mousemove', this.StartPointerMove(shift).bind(this));
    $(document).on('mouseup', this.StopPointerMove.bind(this));
  }

  public StartPointerMove(shift: number) {
    return (e: object) => {
      this.model.state = this.model.getState();
      this.pointerPosition = this.getPointerPosition(this.view.sliderBodyHtml[0], this.view.viewType, shift, e);
      this.checkStep();
    };
  }

  private checkStep() {
    const cursorPosition = this.model.getValuePercent(this.sliderParams, this.pointerPosition);
    const getBreakPoints = () => {
      const result: number[] = [];
      let from = Number(this.model.valueFrom);

      while (from <= this.model.valueTo) {
        result.push(Math.floor(from));
        from += Number(this.model.pointerStepSize);
      }
      return result;
    };

    getBreakPoints().map((breakpoint) => {
      if (cursorPosition === breakpoint) {
        this.pointerPosition = this.model.checkSliderArea(this.pointerPosition, this.sliderParams);
        this.model.setState(this.targetedPointer, this.model.getValuePercent(this.sliderParams, this.pointerPosition));
        this.moveTargetPointer(this.pointerPosition);
      }
    });
  }

  public moveCurrentPointer(direction: string, eq: number, expression: any) {
    direction === 'left'
      ? $(this.getNthPointer(eq)).css({
        left: `${expression}px`,
      })
      : $(this.getNthPointer(eq)).css({
        top: `${expression}px`,
      });
  }

  private checkCollision(direction) {
    if (this.model.checkCollision(this.model.state)) {
      if (this.targetedPointer === this.getNthPointer(0)[0]) {}
      this.targetedPointer === this.getNthPointer(0)[0]
        ? this.moveCurrentPointer(direction, this.model.state.length - 1, this.model.PercentToPx(this.sliderParams, this.minValue.pointerValue))
        : this.moveCurrentPointer(direction, 0, this.model.PercentToPx(this.sliderParams, this.maxValue.pointerValue));
    }
  }

  public moveTargetPointer(position: number) {
    if (this.view.viewType === 'horizontal') {
      this.checkCollision(this.activeDirection);

      $(this.targetedPointer).css({
        left: `${position}px`,
      });
    } else if (this.view.viewType === 'vertical') {
      this.checkCollision(this.activeDirection);

      $(this.targetedPointer).css({
        top: `${position}px`,
      });
    } else {
      console.log('не удалось изменить положение pointer');
    }
  }

  public StopPointerMove(): void {
    $(document).off('mousemove');
  }

  public initSettings(activity: boolean) {
    if (!activity) {
      return false;
    }
    this.panel = new SettingsPanel.Panel();
    this.panel.renderSettingsPanel(this.sliderExemplar);
    const that = this;

    const refreshSlider = () => {
      this.view.destroySlider();
      this.view.renderSlider(this.sliderExemplar, this.model.getPointerCount(this.sliderType));
      this.AccessToDragging();
    };

    const uncheck = (checkBoxList: any) => {
      checkBoxList.map((itm) => itm.children().prop('checked', false));
    };

    const checkOnErrors = (checkingInput: JQuery<HTMLElement>, value: number) => {
      const sounds = {
        error: new Audio('./src/assets/sounds/sound__error.mp3'),
      };

      if (Number(value) > that.model.valueTo || Number(value) < that.model.valueFrom) {
        $(checkingInput).css('box-shadow', '0 0 4px 1px red');
        sounds.error.play();
      } else {
        $(checkingInput).css('box-shadow', 'none');
      }
    };

    const getStateInputs = () => {
      const inputState: JQuery<HTMLElement>[] = [];
      for (let i = 0; i < this.model.state.length; i++) {
        const InputObj = {
          mounted() {
            that.model.setState(that.model.state[i].pointerItem, $(gettedInput).val());

            that.model.observer.subscribe((data) => {
              for (let i = 0; i < that.model.state.length; i++) {
                that.moveCurrentPointer(that.activeDirection, i, that.model.PercentToPx(that.sliderParams, that.model.state[i].pointerValue));
              }
              return data;
            });
          },

          destroy() {

          },

          text: this.model.state[i].pointerValue,
        };

        let gettedInput = this.panel.getInput(InputObj);
        inputState.push(gettedInput);
      }
      return inputState;
    };

    let stateInputList: any = [];

    const singleValueCheckBox = {
      mounted() {
        uncheck([getValue]);
        stateInputList.map((input) => {
          $(input).remove();
        });

        stateInputList = [];

        that.setSliderType('singleValue');
        refreshSlider();
        const stateInputs = getStateInputs();

        stateInputs.map((item) => {
          stateInputList.push(item);
        });

        that.model.observer.subscribe((data) => {
          for (let i = 0; i < that.model.state.length; i++) {
            that.panel.settingsPanel.find(stateInputs[0]).val(that.model.state[0].pointerValue);
          }
          return data;
        });
      },

      destroy() {
        // do something
      },

      text: 'одиночное значение',
    };

    const doubleValueCheckBox = {
      inputList: [],
      mounted() {
        uncheck([getValue]);
        stateInputList.map((input) => {
          $(input).remove();
        });

        stateInputList = [];

        that.setSliderType('doubleValue');
        refreshSlider();
        const stateInputs = getStateInputs();

        stateInputs.map((item) => {
          stateInputList.push(item);
        });

        that.model.observer.subscribe((data) => {
          for (let i = 0; i < that.model.state.length; i++) {
            that.panel.settingsPanel.find(stateInputs[i]).val(that.model.state[i].pointerValue);
          }
          return data;
        });
      },

      destroy() {
        // do something
      },

      text: 'интервал',
    };

    const showValueCheckbox: object = {
      mounted() {
        that.getValueIndicator(that.model.state);
      },
      destroy() {
        that.view.removeValueIndicator();
      },
      text: 'Показывать значение',
    };

    const horizontalViewCheckbox = {
      mounted() {
        uncheck([getValue]);
        that.setViewType('horizontal');
        refreshSlider();
        that.setSliderType(that.sliderType);
      },
      destroy() {
        that.view.destroySlider();
      },
      text: 'Горизонтальный вид',
    };

    const verticalViewCheckbox = {
      mounted() {
        uncheck([getValue]);
        that.setViewType('vertical');
        refreshSlider();
        that.setSliderType(that.sliderType);
      },
      destroy() {
        that.view.destroySlider();
      },
      text: 'Вертикальный вид',
    };

    const stepSizeObj = {
      mounted(stepSize) {
        checkOnErrors(stepSizeInput, stepSize);
        that.model.setStepSize(stepSize);
      },

      text: 'шаг',
    };

    const stepSizeInput: JQuery<HTMLElement> = this.panel.getInput(stepSizeObj);
    const getValue: JQuery<HTMLElement> = this.panel.getCheckBox(showValueCheckbox);
    this.panel.getRadio(singleValueCheckBox, 'valueType');
    this.panel.getRadio(doubleValueCheckBox, 'valueType');
    this.panel.getRadio(horizontalViewCheckbox, 'viewType');
    this.panel.getRadio(verticalViewCheckbox, 'viewType');

    if (this.sliderType === 'singleValue') {
      singleValueCheckBox.mounted();
    } else if (this.sliderType === 'doubleValue') {
      doubleValueCheckBox.mounted();
    }
  }
}
