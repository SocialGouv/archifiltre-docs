import Box from "@material-ui/core/Box";
import React from "react";
import styled from "styled-components";

import type {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "../../../reducers/icicle-sort-method/icicle-sort-method-types";
import { ElementWeightMethodPicker } from "./element-weight-method-picker";
import { IcicleColorModePicker } from "./icicle-color-mode-picker";
import { IciclesSortOrderPicker } from "./icicle-sort-order-picker";
import { MoveFilesButton } from "./move-files-button";
import { ZoomPicker } from "./zoom-picker";

const Wrapper = styled.div`
  width: 100%;
`;

export interface NavigationBarProps {
  elementWeightMethod: ElementWeightMethod;
  icicleColorMode: IcicleColorMode;
  icicleSortMethod: IcicleSortMethod;
  setElementWeightMethod: (method: ElementWeightMethod) => void;
  setIcicleColorMode: (method: IcicleColorMode) => void;
  setIcicleSortMethod: (sortMethod: IcicleSortMethod) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  elementWeightMethod,
  icicleColorMode,
  icicleSortMethod,
  setIcicleSortMethod,
  setElementWeightMethod,
  setIcicleColorMode,
}) => (
  <Wrapper>
    <Box display="flex">
      <Box pt={1} pr={1}>
        <ZoomPicker />
      </Box>
      <Box pt={1} pr={1}>
        <MoveFilesButton />
      </Box>
      <Box flexGrow={1} />
      <Box pt={1} pl={1}>
        <IciclesSortOrderPicker
          icicleSortMethod={icicleSortMethod}
          setIcicleSortMethod={setIcicleSortMethod}
        />
      </Box>
      <Box pt={1} pl={1}>
        <ElementWeightMethodPicker
          elementWeightMethod={elementWeightMethod}
          setElementWeightMethod={setElementWeightMethod}
        />
      </Box>
      <Box pt={1} pl={1}>
        <IcicleColorModePicker
          icicleColorMode={icicleColorMode}
          setIcicleColorMode={setIcicleColorMode}
        />
      </Box>
    </Box>
  </Wrapper>
);
