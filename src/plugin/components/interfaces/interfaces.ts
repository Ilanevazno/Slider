export interface JqueryPluginElement extends JQuery<HTMLElement> {
  sliderPlugin?: Function;
}

export interface JQueryExtendedEvent extends JQueryEventObject {
  touches?: TouchEvent;
}
