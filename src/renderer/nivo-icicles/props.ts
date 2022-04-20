import type { OrdinalColorScaleConfig } from "@nivo/colors";

import { IciclesTooltip } from "./IciclesTooltip";
import type { IciclesDirection, IciclesLayerId } from "./types";

export const defaultIciclesProps = {
  animate: true,
  borderColor: "white",
  borderWidth: 1,
  childColor: { from: "color" },
  colorBy: "id" as const,
  colors: { scheme: "nivo" } as unknown as OrdinalColorScaleConfig,
  defs: [],
  direction: "bottom" as IciclesDirection,
  enableRectLabels: false,
  fill: [],
  id: "id",
  inheritColorFromParent: true,
  isInteractive: true,
  layers: ["rect", "rectLabels"] as IciclesLayerId[],
  motionConfig: "gentle",
  rectLabel: "formattedValue",
  rectLabelsTextColor: { theme: "labels.text.fill" },
  role: "img",
  tooltip: IciclesTooltip,
  value: "value",
};
