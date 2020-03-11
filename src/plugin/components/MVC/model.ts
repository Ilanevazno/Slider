const constant = require('../../constant.json');

class Model {
  private valueFrom = 0

  private valueTo = 100;

  private pointerStepSize = 1;

  private state: any;

  private observer: any;

  public classList: any = {
    sliderBodyClass: constant.classes.sliderBody,
    pointerClass: constant.classes.pointer,
    valueClass: constant.classes.value,
    trackLineClass: constant.classes.trackLine,
  }

  constructor(observer: any) {
    this.observer = observer;
  }

  public getPointerCount(sliderType: string) {
    let pointersCount: number | null = null;
    pointersCount = sliderType === constant.singleValue ? 1 : 2;

    return pointersCount;
  }

  public setStepSize(stepSize: number) {
    this.pointerStepSize = stepSize;
  }

  public initState(initState: any) {
    this.state = [];
    const valuesArr: any = [];
    for (let i = 0; i < initState.pointerList.length; i += 1) {
      let currentValue: any;

      switch (initState.sliderViewType) {
        case 'vertical':
          currentValue = Number(initState.pointerList[i].sliderPointer.css('top').replace('px', ''));
          break;
        case 'horizontal':
          currentValue = Number(initState.pointerList[i].sliderPointer.css('left').replace('px', ''));
          break;
        default:
          currentValue = 0;
      }

      const convertedPerc = this.getValuePercent(initState.sliderWidth, currentValue);
      valuesArr.push([convertedPerc, initState.pointerList[i].sliderPointer[0]]);
    }

    this.state = valuesArr.map((cv: any[], idx: number) => ({
      pointerName: `pointer_${idx + 1}`,
      pointerValue: cv[0],
      pointerItem: cv[1],
    }));

    return this.state;
  }

  public getState() {
    return this.state;
  }

  public setState(targetPointer: any, val: any) {
    this.state.map((item: { pointerItem: any; pointerValue: number | null }) => {
      const value = item;

      if (targetPointer === item.pointerItem) {
        value.pointerValue = Number(val);
      }
      return targetPointer;
    });

    for (let i = 0; i < this.state.length; i += 1) {
      const everyPointers = this.state[i];
      const lastPointer = this.state[this.state.length - 1];

      // checking to do collision
      if (targetPointer !== lastPointer.pointerItem) {
        if (everyPointers.pointerValue >= lastPointer.pointerValue) {
          lastPointer.pointerValue = everyPointers.pointerValue;
        }
      }

      if (lastPointer.pointerValue < everyPointers.pointerValue) {
        everyPointers.pointerValue = lastPointer.pointerValue;
      }

      // checking each pointer to min and max values
      if (everyPointers.pointerValue <= this.valueFrom) {
        everyPointers.pointerValue = this.valueFrom;
      }

      if (everyPointers.pointerValue >= this.valueTo) {
        everyPointers.pointerValue = this.valueTo;
      }
    }
    this.observer.broadcast({ state: this.state });
  }

  public checkCollision(values: { pointerValue: number }[]) {
    const minValue: number = values[0].pointerValue;
    const maxValue: number = values[Object.keys(values).length - 1].pointerValue;
    return minValue >= maxValue;
  }

  public checkStepSettings(cursorPosition: number) {
    return cursorPosition % this.pointerStepSize === 0;
  }

  public getCoords(elem: JQuery<HTMLElement>) {
    const box = elem[0].getBoundingClientRect();
    return {
      // eslint-disable-next-line no-restricted-globals
      left: box.left + pageXOffset,
    };
  }

  public checkSliderArea(pointerPosition: number, sliderWidth: number) {
    let cursor = pointerPosition;
    if (pointerPosition < 0) {
      cursor = 0;
    }

    if (pointerPosition > sliderWidth) {
      cursor = sliderWidth;
    }

    return cursor;
  }

  public getValuePercent(sliderWidth: number, currentPx: number) {
    return Math.round(this.valueTo * (currentPx / sliderWidth));
  }

  public PercentToPx(sliderWidth: number, percentages: number) {
    return Math.round((sliderWidth / this.valueTo) * percentages);
  }
}


export default Model;
