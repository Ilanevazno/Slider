import HandlerView from '../View/HandlerView/HandlerView';

export type AvailableOptions = {
  stepSize: number;
  minAvailableValue: number;
  maxAvailableValue: number;
  minCurrentValue?: number;
  maxCurrentValue?: number;
  axis: Axis;
  withLabels: boolean;
  withTooltip: boolean;
  valueType: ValueType;
  breakpoints?: number[];
}

export type UnconvertedStateItem = {
  name: 'minValue' | 'maxValue';
  value: number;
}

export type HandlerName = 'minValue' | 'maxValue';

export type SliderBreakpoint = {
  currentValue: number;
  pixelPosition: number;
}

export type HandlerEvent = {
  name: string;
  value: number;
}

export type ViewHandlerData = {
  handler?: HandlerView;
  name: HandlerName;
  value?: number;
}

export type ModelListener = {
  state: ModelState;
  axis: Axis;
  withTooltip: boolean;
}

export type ObserverEvent<T> = {
  type: string;
  data: T;
}

export type BodyBreakpointsData = {
  axis: string;
  offsetHandlerWidth: number;
  currentBreakpointList: number[];
  minAvailableValue: number;
  maxAvailableValue: number;
}

export type ModelState = {
  minValue?: number;
  maxValue?: number;
}

export type ConvertingData = {
  minPercent: number;
  maxPercent: number;
  currentValue: number;
  maxValue: number;
}

export enum ValueType {
  SINGLE = 'single',
  DOUBLE = 'double'
}

export type Axis = 'X' | 'Y';

export interface JqueryPluginElement extends JQuery<HTMLElement> {
  sliderPlugin?: Function;
}

export enum Response {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum CustomEvents {
  RESPONSE_ACTUAL_STATE = 'RESPONSE_ACTUAL_STATE',
  VIEW_WILL_REFRESH = 'VIEW_WILL_REFRESH',
  HANDLER_WILL_MOUNT = 'HANDLER_WILL_MOUNT',
  BREAKPOINT_CLICKED = 'BREAKPOINT_CLICKED',
  INTERACTIVE_COMPONENT_CLICKED = 'INTERACTIVE_COMPONENT_CLICKED',
  BODY_CLICKED = 'BODY_CLICKED',
  HANDLER_MOUSEMOVE = 'HANDLER_MOUSEMOVE',
  HANDLER_TOUCHMOVE = 'HANDLER_TOUCHMOVE',
  WINDOW_RESIZED = 'WINDOW_RESIZED',
  TOOLTIP_ACTIVITY_CHANGED = 'TOOLTIP_ACTIVITY_CHANGED',
  LABELS_ACTIVITY_CHANGED = 'LABELS_ACTIVITY_CHANGED',
  MIN_AVAILABLE_VALUE_CHANGED = 'MIN_AVAILABLE_VALUE_CHANGED',
  MAX_AVAILABLE_VALUE_CHANGED = 'MAX_AVAILABLE_VALUE_CHANGED',
  STATE_CHANGED = 'STATE_CHANGED',
  STATE_CLEARED = 'STATE_CLEARED',
  STATE_REFRESHED = 'STATE_REFRESHED',
  VALUE_TYPE_CHANGED = 'VALUE_TYPE_CHANGED',
  STEP_SIZE_CHANGED = 'STEP_SIZE_CHANGED',
  AXIS_CHANGED = 'AXIS_CHANGED',
}
