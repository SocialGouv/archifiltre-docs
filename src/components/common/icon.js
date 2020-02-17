import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FaFolder, FaFile, FaCopy, FaSearch } from "react-icons/fa";

export const FOLDER_ICON = FaFolder;
export const PAGE_ICON = FaFile;
export const PAGE_MULTIPLE_ICON = FaCopy;
export const SEARCH_ICON = FaSearch;

const IconContainer = styled.div`
  margin-top: -1em;
  margin-bottom: -1em;
`;

/** Displays an icon */
const Icon = ({ icon, color, onClick }) => {
  const Icon = icon;
  return (
    <IconContainer onClick={onClick}>
      <Icon color={color} style={{ fontSize: "3em" }} />
    </IconContainer>
  );
};

Icon.propTypes = {
  /** The represented icon. Should be an icon from the icon component. */
  icon: PropTypes.string.isRequired,
  /** The icon color. */
  color: PropTypes.string,
  /** The click callback */
  onClick: PropTypes.func
};

export default Icon;
