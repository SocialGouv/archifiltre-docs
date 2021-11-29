import noop from "lodash/noop";
import type { MouseEventHandler } from "react";
import React from "react";
import {
    FaChevronDown,
    FaChevronRight,
    FaCopy,
    FaFile,
    FaFolder,
    FaSearch,
} from "react-icons/fa";
import styled from "styled-components";

export const FOLDER_ICON = FaFolder;
export const PAGE_ICON = FaFile;
export const PAGE_MULTIPLE_ICON = FaCopy;
export const SEARCH_ICON = FaSearch;
export const EXPAND_ICON = FaChevronRight;
export const COLLAPSE_ICON = FaChevronDown;

const IconWrapper = styled.span<{
    onClick?: MouseEventHandler<HTMLSpanElement>;
}>`
    ${({ onClick }) => onClick && "cursor: pointer"}
`;

type IconComponent =
    | typeof COLLAPSE_ICON
    | typeof EXPAND_ICON
    | typeof FOLDER_ICON
    | typeof PAGE_ICON
    | typeof PAGE_MULTIPLE_ICON
    | typeof SEARCH_ICON;

type IconSize = "big" | "normal" | "small";

const iconSizes: { [size in IconSize]: string } = {
    big: "3em",
    normal: "2em",
    small: "1em",
};

export interface IconProps {
    icon: IconComponent;
    color: string;
    size?: IconSize;
    onClick?: () => void;
}

/** Displays an icon */
export const Icon: React.FC<IconProps> = ({
    icon,
    size = "big",
    color,
    onClick = noop,
}) => {
    const InnerIcon = icon;
    return (
        <IconWrapper onClick={onClick}>
            <InnerIcon color={color} style={{ fontSize: iconSizes[size] }} />
        </IconWrapper>
    );
};
