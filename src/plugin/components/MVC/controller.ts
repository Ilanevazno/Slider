/* eslint-disable @typescript-eslint/no-use-before-define */
import { SettingsPanel } from '../Panel/Panel';

const constant = require('../../constant.json');

class Controller {
  public observer: any

  public model: any;

  public view: any;

  public panel!: any;

  private sliderParams: number | null = 0;

  private pointerPosition: any = 0;

  public targetedPointer: any;

  private minValue!: any;

  private maxValue: any;

  public sliderType: valueCount = constant.singleValue;

  public sliderExemplar!: object;

  private activeDirection!: string;

  constructor(model: classExemplar, view: classExemplar, observer: classExemplar) {
    this.model = model;
    this.view = view;
    this.observer = observer;
  }

  setMinValue(value: number): void {
    this.model.valueFrom = value;
  }

  public setMaxValue(value: number): void {
    this.model.valueTo = value;
  }

  public setStepSize(size: number): void {
    this.model.pointerStepSize = size;
  }

  public setViewType(viewType: string): void {
    this.view.viewType = viewType;
    this.activeDirection = this.view.viewType === constant.axisX ? 'left' : 'top';
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

  public getPointerPosition(data = {}) {
    const {
      sliderBody,
      sliderViewType,
      shift,
      target,
    }: any = data;

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
    for (let i = 0; i < this.model.state.length; i += 1) {
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
      [this.minValue] = this.model.state;
      this.maxValue = this.model.state[Object.keys(this.model.state).length - 1];
    }

    for (let i = 0; i < this.model.state.length; i += 1) {
      const element = this.model.state[i].pointerItem;
      $(element).on('mousedown', (e: any) => {
        e.preventDefault();

        this.targetedPointer = e.currentTarget;

        const shiftDirection: any = this.getShiftВirection(this.view.viewType, e, element);
        this.prepareForUsing(shiftDirection);
      });
    }

    this.model.observer.subscribe((data) => {
      for (let i = 0; i < this.model.state.length; i += 1) {
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
      const pointerPositionData = {
        sliderBody: this.view.sliderBodyHtml[0],
        sliderViewType: this.view.viewType,
        shift,
        target: e,
      };

      this.pointerPosition = this.getPointerPosition(pointerPositionData);
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
        const nextStateValue = this.model.getValuePercent(this.sliderParams, this.pointerPosition);
        this.model.setState(this.targetedPointer, nextStateValue);
        this.moveTargetPointer(this.pointerPosition);
      }

      return this.pointerPosition;
    });
  }

  public moveCurrentPointer(data = {}) {
    const {
      direction,
      currentPointer,
      expression,
    }: any = data;

    // eslint-disable-next-line no-unused-expressions
    direction === 'left'
      ? $(this.getNthPointer(currentPointer)).css({
        left: `${expression}px`,
      })
      : $(this.getNthPointer(currentPointer)).css({
        top: `${expression}px`,
      });
  }

  private checkCollision(direction) {
    if (this.model.checkCollision(this.model.state)) {
      const data: any = {
        direction,
        currentPointer: null,
        expression: null,
      };

      if (this.targetedPointer === this.getNthPointer(0)[0]) {
        data.currentPointer = this.model.state.length - 1;
        data.expression = this.model.PercentToPx(this.sliderParams, this.minValue.pointerValue);
      } else {
        data.currentPointer = 0;
        data.expression = this.model.PercentToPx(this.sliderParams, this.maxValue.pointerValue);
      }

      this.moveCurrentPointer(data);
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
      for (let i = 0; i < this.model.state.length; i += 1) {
        const InputObj = {
          mounted() {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            that.model.setState(that.model.state[i].pointerItem, $(gettedInput).val());

            that.model.observer.subscribe((data) => {
              for (let z = 0; z < that.model.state.length; z += 1) {
                const movingData = {
                  direction: that.activeDirection,
                  currentPointer: z,
                  // eslint-disable-next-line max-len
                  expression: that.model.PercentToPx(that.sliderParams, that.model.state[z].pointerValue),
                };
                that.moveCurrentPointer(movingData);
              }
              return data;
            });
          },

          destroy() {
            // do stuff
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
          return true;
        });

        stateInputList = [];

        that.setSliderType('singleValue');
        refreshSlider();
        const stateInputs = getStateInputs();

        stateInputs.map((item) => {
          stateInputList.push(item);
          return true;
        });

        that.model.observer.subscribe((data) => {
          for (let i = 0; i < that.model.state.length; i += 1) {
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
          return true;
        });

        stateInputList = [];

        that.setSliderType('doubleValue');
        refreshSlider();
        const stateInputs = getStateInputs();

        stateInputs.map((item) => {
          stateInputList.push(item);
          return true;
        });

        that.model.observer.subscribe((data) => {
          for (let i = 0; i < that.model.state.length; i += 1) {
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

export default Controller;
