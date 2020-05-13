import { pixelToPercentConverting, percentToPixelConverting } from '../../types/types';

class ValidateView {
  private currentPointerShift: number;

  constructor() {
    this.currentPointerShift = 0;
  }

  public setPointerShift(newShift: number): void {
    this.currentPointerShift = newShift;
  }

  public getPointerShift(): number {
    return this.currentPointerShift;
  }

  public convertPixelToPercent(data: pixelToPercentConverting): any {
    const {
      currentPixel,
      containerWidth,
      maxPercent,
      minPercent,
    } = data;
    return Math.ceil((currentPixel * (maxPercent - minPercent)) / containerWidth);
  }

  public convertPercentToPixel(data: percentToPixelConverting): any {
    const {
      minPercent,
      maxPercent,
      currentPercent,
      maxContainerWidth
    } = data;

    return ((currentPercent - minPercent) / (maxPercent - minPercent)) * maxContainerWidth;
  }
}

export default ValidateView;