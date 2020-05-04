class ValidateView {
  private currentPointerShift: number;
  public mouseDownEvent: string;
  public mouseMoveEvent: string;

  constructor () {
    this.currentPointerShift = 0;
    this.mouseDownEvent = 'mousedown';
    this.mouseMoveEvent = 'mousemove';
  }

  public setPointerShift (newShift): void {
    this.currentPointerShift = newShift;
  }

  public getPointerShift (): number {
    return this.currentPointerShift;
  }

  public convertPixelToPercent (data: any = {}): any {
    const {
      currentPixel,
      containerWidth,
      maxPercent,
      minPercent,
    } = data;
    return Math.ceil((currentPixel * (maxPercent - minPercent)) / containerWidth);
  }

  public convertPercentToPixel (data: any = {}): any {
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