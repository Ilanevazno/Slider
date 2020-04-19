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
    return Math.ceil((currentPixel * 101) / containerWidth);
  }
}

export default ValidateView;