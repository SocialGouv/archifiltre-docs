import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const FOLDER_ICON = "fi-folder";
export const PAGE_ICON = "fi-page";
export const PAGE_MULTIPLE_ICON = "fi-page-multiple";
export const MAGNIFYING_GLASS_ICON = "fi-magnifying-glass";

const I = styled.i`
  font-size: 3em;
  color: ${props => props.color};
`;

const IconContainer = styled.div`
  margin-top: -1em;
  margin-bottom: -1em;
`;

/** Displays an icon */
const Icon = ({ icon, color, onClick }) => (
  <IconContainer onClick={onClick}>
    <I className={icon} color={color} />
  </IconContainer>
);

Icon.propTypes = {
  /** The represented icon. Should be an icon from the icon component. */
  icon: PropTypes.string.isRequired,
  /** The icon color. */
  color: PropTypes.string,
  /** The click callback */
  onClick: PropTypes.func
};

export default Icon;
