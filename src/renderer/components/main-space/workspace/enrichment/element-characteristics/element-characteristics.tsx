import { branch } from "../../../../../hoc/branch";
import {
  ElementCharacteristicsContent,
  type ElementCharacteristicsContentProps,
} from "./element-characteristics-content";
import { ElementCharacteristicsNoElement } from "./element-characteristics-no-element";

export const ElementCharacteristics = branch<ElementCharacteristicsContentProps>(
  ({ elementName }) => elementName === "",
  ElementCharacteristicsNoElement,
  ElementCharacteristicsContent,
);
