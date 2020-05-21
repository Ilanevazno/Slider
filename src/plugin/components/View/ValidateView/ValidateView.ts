import { convertingData } from '../../types/types';

class ValidateView {
  private currentHandlerShift: number;

  constructor() {
    this.currentHandlerShift = 0;
  }

  public setHandlerShift(newShift: number): void {
    this.currentHandlerShift = newShift;
  }

  public getHandlerShift(): number {
    return this.currentHandlerShift;
  }

  public convertPixelToPercent(data: convertingData): number {
    const {
      maxPercent,
      minPercent,
      currentValue,
      htmlContainerWidth,
    } = data;
    return Math.trunc((currentValue * (maxPercent - minPercent)) / htmlContainerWidth);
  }

  public convertPercentToPixel(data: convertingData): number {
    const {
      minPercent,
      maxPercent,
      currentValue,
      htmlContainerWidth,
    } = data;

    return Math.trunc(((currentValue - minPercent) / (maxPercent - minPercent)) * htmlContainerWidth);
  }
}

export default ValidateView;
