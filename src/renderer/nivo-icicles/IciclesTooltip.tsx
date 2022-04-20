import { BasicTooltip } from "@nivo/tooltip";
import React from "react";

import type { IciclesComputedDatum } from "./types";

export const IciclesTooltip = <TRawDatum,>({
  id,
  formattedValue,
  color,
}: IciclesComputedDatum<TRawDatum>): JSX.Element => (
  <BasicTooltip
    id={id}
    value={formattedValue}
    enableChip={true}
    color={color}
  />
);
