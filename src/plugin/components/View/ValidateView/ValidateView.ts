import { pixelToPercentConverting, percentToPixelConverting } from '../../types/types';

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

  public convertPixelToPercent(data: pixelToPercentConverting): any {
    const {
      currentPixel,
      containerWidth,
      maxPercent,
      minPercent,
    } = data;
    return Math.trunc((currentPixel * (maxPercent - minPercent)) / containerWidth);
  }

  public convertPercentToPixel(data: percentToPixelConverting): any {
    const {
      minPercent,
      maxPercent,
      currentPercent,
      maxContainerWidth,
    } = data;

    console.log(((currentPercent - minPercent) / (maxPercent - minPercent)) * maxContainerWidth);

    return Math.trunc(((currentPercent - minPercent) / (maxPercent - minPercent)) * maxContainerWidth);
  }
}

export default ValidateView;
