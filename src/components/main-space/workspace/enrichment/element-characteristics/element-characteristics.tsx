import ElementCharacteristicsNoElement from "components/main-space/workspace/enrichment/element-characteristics/element-characteristics-no-element";
import { branch } from "hoc/branch";

import type { ElementCharacteristicsContentProps } from "./element-characteristics-content";
import ElementCharacteristicsContent from "./element-characteristics-content";

const ElementCharacteristics = branch<ElementCharacteristicsContentProps>(
    ({ elementName }) => elementName === "",
    ElementCharacteristicsNoElement,
    ElementCharacteristicsContent
);

export default ElementCharacteristics;
