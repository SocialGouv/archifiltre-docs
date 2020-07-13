import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import BackToRootButton from "./back-to-root-button";
import ToggleWidthBySize from "./toggle-width-by-size";
import MoveFilesButton from "./move-files-button";
import IciclesSortOrderPicker from "./icicle-sort-order-picker";
import styled from "styled-components";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";

const Wrapper = styled.div`
  width: 100%;
`;

type NavigationBarProps = {
  api: any;
  icicleSortMethod: IcicleSortMethod;
  setIcicleSortMethod: (sortMethod: IcicleSortMethod) => void;
  setNoFocus: () => void;
};

export const NavigationBar: FC<NavigationBarProps> = ({
  api,
  icicleSortMethod,
  setIcicleSortMethod,
  setNoFocus,
}) => (
  <Wrapper>
    <Box display="flex">
      <Box pt={1} pr={1}>
        <BackToRootButton api={api} setNoFocus={setNoFocus} />
      </Box>
      <Box pt={1} pr={1}>
        <MoveFilesButton />
      </Box>
      <Box flexGrow={1} />
      <Box p={1}>
        <IciclesSortOrderPicker
          icicleSortMethod={icicleSortMethod}
          setIcicleSortMethod={setIcicleSortMethod}
        />
      </Box>
      <Box pt={1}>
        <ToggleWidthBySize api={api} />
      </Box>
    </Box>
  </Wrapper>
);
