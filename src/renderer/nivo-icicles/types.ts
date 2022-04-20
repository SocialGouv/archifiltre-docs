import type {
  InheritedColorConfig,
  OrdinalColorScaleConfig,
} from "@nivo/colors";
import type {
  Box,
  ModernMotionProps,
  PropertyAccessor,
  SvgDefsAndFill,
  Theme,
  ValueFormat,
} from "@nivo/core";

import type { RectLabelsProps } from "./nivo-rects/rect_labels/props";
import type { Rect } from "./nivo-rects/types";

export type DatumId = number | string;

export type IciclesLayerId = "rectLabels" | "rects";

export interface IciclesCustomLayerProps<TRawDatum> {
  nodes: IciclesComputedDatum<TRawDatum>[];
}

export type IciclesCustomLayer<TRawDatum> = React.FC<
  IciclesCustomLayerProps<TRawDatum>
>;

export type IciclesLayer<TRawDatum> =
  | IciclesCustomLayer<TRawDatum>
  | IciclesLayerId;

export interface DataProps<TRawDatum> {
  data: TRawDatum;
  id?: PropertyAccessor<TRawDatum, DatumId>;
  value?: PropertyAccessor<TRawDatum, number>;
  valueFormat?: ValueFormat<number>;
}

export interface ChildrenDatum<TRawDatum> {
  children?: (ChildrenDatum<TRawDatum> & TRawDatum)[];
}

export interface IciclesComputedDatum<TRawDatum> {
  color: string;
  // contains the raw node's data
  data: TRawDatum;
  depth: number;
  // defined when using patterns or gradients
  fill?: string;
  formattedValue: string;
  height: number;
  id: DatumId;
  parent?: IciclesComputedDatum<TRawDatum>;
  // contain own id plus all ancestor ids
  path: DatumId[];
  percentage: number;
  rect: Rect;
  transform: string;
  value: number;
}

export type IciclesDirection = "bottom" | "left" | "right" | "top";

export type IciclesCommonProps<TRawDatum> = RectLabelsProps<
  IciclesComputedDatum<TRawDatum>
> & {
  animate: boolean;
  borderColor: InheritedColorConfig<IciclesComputedDatum<TRawDatum>>;
  borderWidth: number;
  // used if `inheritColorFromParent` is `true`
  childColor: InheritedColorConfig<IciclesComputedDatum<TRawDatum>>;
  colorBy: "depth" | "id";
  colors: OrdinalColorScaleConfig<
    Omit<IciclesComputedDatum<TRawDatum>, "color" | "fill">
  >;
  data: TRawDatum;
  direction: IciclesDirection;
  enableRectLabels: boolean;
  height: number;
  id: PropertyAccessor<TRawDatum, DatumId>;
  inheritColorFromParent: boolean;
  isInteractive: boolean;
  layers: IciclesLayer<TRawDatum>[];
  margin?: Box;
  motionConfig: ModernMotionProps["motionConfig"];
  rectLabelsTextColor: InheritedColorConfig<TRawDatum>;
  renderWrapper: boolean;
  role: string;
  theme: Theme;
  tooltip: (props: IciclesComputedDatum<TRawDatum>) => JSX.Element;
  value: PropertyAccessor<TRawDatum, number>;
  valueFormat?: ValueFormat<number>;
  width: number;
};

export type IciclesMouseHandler<TRawDatum> = (
  datum: IciclesComputedDatum<TRawDatum>,
  event: React.MouseEvent
) => void;

export type IciclesMouseHandlers<TRawDatum> = Partial<{
  onClick: IciclesMouseHandler<TRawDatum>;
  onMouseEnter: IciclesMouseHandler<TRawDatum>;
  onMouseLeave: IciclesMouseHandler<TRawDatum>;
  onMouseMove: IciclesMouseHandler<TRawDatum>;
}>;

export type IciclesSvgProps<TRawDatum> = IciclesCommonProps<TRawDatum> &
  IciclesMouseHandlers<TRawDatum> &
  SvgDefsAndFill<TRawDatum>;
