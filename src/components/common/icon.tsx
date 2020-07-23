import React, { FC, MouseEventHandler } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaCopy,
  FaFile,
  FaFolder,
  FaSearch,
} from "react-icons/fa";
import styled from "styled-components";
import { empty } from "util/function/function-util";

export const FOLDER_ICON = FaFolder;
export const PAGE_ICON = FaFile;
export const PAGE_MULTIPLE_ICON = FaCopy;
export const SEARCH_ICON = FaSearch;
export const EXPAND_ICON = FaChevronRight;
export const COLLAPSE_ICON = FaChevronDown;

const IconWrapper = styled.span<{
  onClick: MouseEventHandler<HTMLSpanElement>;
}>`
  ${({ onClick }) => onClick && "cursor: pointer"}
`;

type IconComponent =
  | typeof FOLDER_ICON
  | typeof PAGE_ICON
  | typeof PAGE_MULTIPLE_ICON
  | typeof SEARCH_ICON
  | typeof EXPAND_ICON
  | typeof COLLAPSE_ICON;

type IconSize = "small" | "normal" | "big";

const iconSizes: { [size in IconSize]: string } = {
  small: "1em",
  normal: "2em",
  big: "3em",
};

export type IconProps = {
  icon: IconComponent;
  color: string;
  size?: IconSize;
  onClick?: () => void;
};

/** Displays an icon */
const Icon: FC<IconProps> = ({
  icon,
  size = "big",
  color,
  onClick = empty,
}) => {
  const InnerIcon = icon;
  return (
    <IconWrapper onClick={onClick}>
      <InnerIcon color={color} style={{ fontSize: iconSizes[size] }} />
    </IconWrapper>
  );
};

export default Icon;
