type percentToPixelConverting = {
  minPercent: number,
  maxPercent: number,
  currentPercent: number,
  maxContainerWidth: number,
}

type pixelToPercentConverting = {
  currentPixel: number,
  containerWidth: number,
  minPercent: number,
  maxPercent: number,
}

class ValidateView {
  private currentPointerShift: number;
  public mouseDownEvent: string;
  public mouseMoveEvent: string;

  constructor () {
    this.currentPointerShift = 0;
    this.mouseDownEvent = 'mousedown';
    this.mouseMoveEvent = 'mousemove';
  }

  public setPointerShift (newShift: number): void {
    this.currentPointerShift = newShift;
  }

  public getPointerShift (): number {
    return this.currentPointerShift;
  }

  public convertPixelToPercent (data: pixelToPercentConverting): any {
    const {
      currentPixel,
      containerWidth,
      maxPercent,
      minPercent,
    } = data;
    return Math.ceil((currentPixel * (maxPercent - minPercent)) / containerWidth);
  }

  public convertPercentToPixel (data: percentToPixelConverting): any {
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