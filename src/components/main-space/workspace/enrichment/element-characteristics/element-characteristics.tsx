import { branch } from "../../../../../hoc/branch";
import type { ElementCharacteristicsContentProps } from "./element-characteristics-content";
import { ElementCharacteristicsContent } from "./element-characteristics-content";
import { ElementCharacteristicsNoElement } from "./element-characteristics-no-element";

export const ElementCharacteristics =
  branch<ElementCharacteristicsContentProps>(
    ({ elementName }) => elementName === "",
    ElementCharacteristicsNoElement,
    ElementCharacteristicsContent
  );
