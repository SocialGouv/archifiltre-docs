import { IconButton } from "@material-ui/core";
import type { GridProps } from "@material-ui/core/Grid";
import Grid from "@material-ui/core/Grid";
import React from "react";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";

import { ConditionnalWrap } from "../../hoc/conditionnalWrap";
import { expectToBeDefined } from "../../utils/expect-behaviour";

const Icon = styled(FaPlus)`
  width: 30px;
  height: auto;
  padding-bottom: 20px;
`;

const DropzoneContainer = styled(Grid)`
  border: 1px dashed #868686;
  border-radius: 5px;
  height: 100%;
`;

const PlaceholderContainer = styled(Grid)`
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Placeholder = styled.div`
  font-size: 1.5em;
  text-align: center;
`;

const handleDragover: GridProps["onDragOver"] = (event) => {
  event.preventDefault();
};

export type DropzoneErrorType =
  | "invalidElementDropped"
  | "multipleFolderLoaded";

export interface DropzoneProps {
  onClick?: () => void;
  onError: (type: DropzoneErrorType) => void;
  onPathLoaded: (path: string) => void;
  placeholder: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onPathLoaded,
  onError,
  placeholder,
  onClick,
}) => {
  const handleDrop: NonNullable<GridProps["onDrop"]> = (event) => {
    event.preventDefault();

    const areMultipleFoldersDropped = event.dataTransfer.files.length > 1;

    if (areMultipleFoldersDropped) {
      onError("multipleFolderLoaded");
      return;
    }

    const isFileDefined = expectToBeDefined(event.dataTransfer.files[0], "");

    if (!isFileDefined) {
      onError("invalidElementDropped");
      return;
    }
    const pathToLoad = event.dataTransfer.files[0].path;
    onPathLoaded(pathToLoad);
  };

  return (
    <DropzoneContainer
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      onDragOver={handleDragover}
      onDrop={handleDrop}
    >
      <ConditionnalWrap
        condition={onClick !== undefined}
        wrap={(children) => (
          <IconButton onClick={onClick}>{children}</IconButton>
        )}
      >
        <PlaceholderContainer item>
          <Icon />
          <Placeholder>{placeholder}</Placeholder>
        </PlaceholderContainer>
      </ConditionnalWrap>
    </DropzoneContainer>
  );
};
