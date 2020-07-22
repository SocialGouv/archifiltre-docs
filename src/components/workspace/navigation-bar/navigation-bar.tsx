import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import BackToRootButton from "./back-to-root-button";
import ElementWeightMethodPicker from "components/workspace/navigation-bar/element-weight-method-picker";
import MoveFilesButton from "./move-files-button";
import IciclesSortOrderPicker from "./icicle-sort-order-picker";
import styled from "styled-components";
import {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-types";
import IcicleColorModePicker from "components/workspace/navigation-bar/icicle-color-mode-picker";

const Wrapper = styled.div`
  width: 100%;
`;

type NavigationBarProps = {
  elementWeightMethod: ElementWeightMethod;
  isZoomed: boolean;
  icicleColorMode: IcicleColorMode;
  icicleSortMethod: IcicleSortMethod;
  setIcicleSortMethod: (sortMethod: IcicleSortMethod) => void;
  setNoFocus: () => void;
  resetZoom: () => void;
  setElementWeightMethod: (method: ElementWeightMethod) => void;
  setIcicleColorMode: (method: IcicleColorMode) => void;
};

export const NavigationBar: FC<NavigationBarProps> = ({
  elementWeightMethod,
  isZoomed,
  icicleColorMode,
  icicleSortMethod,
  setIcicleSortMethod,
  setNoFocus,
  resetZoom,
  setElementWeightMethod,
  setIcicleColorMode,
}) => (
  <Wrapper>
    <Box display="flex">
      <Box pt={1} pr={1}>
        <BackToRootButton
          isZoomed={isZoomed}
          resetZoom={resetZoom}
          setNoFocus={setNoFocus}
        />
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
