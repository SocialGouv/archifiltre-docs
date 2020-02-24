import React from "react";
import { FaCopy, FaFile, FaFolder, FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { empty } from "../../util/function-util";

export const FOLDER_ICON = FaFolder;
export const PAGE_ICON = FaFile;
export const PAGE_MULTIPLE_ICON = FaCopy;
export const SEARCH_ICON = FaSearch;

const IconContainer = styled.div`
  margin-top: -1em;
  margin-bottom: -1em;
`;

/** Displays an icon */
const Icon = ({ icon, color, onClick = empty }) => {
  const IconComponent = icon;
  return (
    <IconContainer onClick={onClick}>
      <IconComponent color={color} style={{ fontSize: "3em" }} />
    </IconContainer>
  );
};

export default Icon;
