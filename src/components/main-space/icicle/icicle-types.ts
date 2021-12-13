import type { MouseEvent } from "react";

import type { DimsAndId } from "./icicle-rect";

export type FillColor = (id: string) => string;

export type IcicleMouseActionHandler = (
  dimsAndId: DimsAndId,
  event: MouseEvent
) => void;
