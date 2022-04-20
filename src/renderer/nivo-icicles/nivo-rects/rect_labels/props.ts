import type { InheritedColorConfig } from "@nivo/colors";
import type { PropertyAccessor } from "@nivo/core";

import type { DatumWithRectAndColor } from "../types";
import type { RectLabelComponent } from "./RectLabelsLayer";

export interface RectLabelsProps<TDatum extends DatumWithRectAndColor> {
  rectLabel: PropertyAccessor<TDatum, string>;
  rectLabelsComponent: RectLabelComponent<TDatum>;
  rectLabelsTextColor: InheritedColorConfig<TDatum>;
}
