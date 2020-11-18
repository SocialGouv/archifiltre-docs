import ElementCharacteristicsContent, {
  ElementCharacteristicsContentProps,
} from "./element-characteristics-content";
import { branch } from "hoc/branch";
import ElementCharacteristicsNoElement from "components/main-space/workspace/enrichment/element-characteristics/element-characteristics-no-element";

const ElementCharacteristics = branch<ElementCharacteristicsContentProps>(
  ({ elementName }) => elementName === "",
  ElementCharacteristicsNoElement,
  ElementCharacteristicsContent
);

export default ElementCharacteristics;
