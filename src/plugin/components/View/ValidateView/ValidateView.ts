class ValidateView {
  private currentPointerShift: number;

  constructor () {
    this.currentPointerShift = 0;
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