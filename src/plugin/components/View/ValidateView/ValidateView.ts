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

  public convertPixelToPercent (containerWidth: number, currentPixel: number): number {
    return Math.ceil((currentPixel * 100) / containerWidth);
  }

  public convertPercentToPixel (containerWidth: number, currentPecent: number): number {
    return Math.ceil((currentPecent / 100) * containerWidth);
  }
}

export default ValidateView;