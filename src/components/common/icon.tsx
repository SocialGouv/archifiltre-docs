import React, { FC } from "react";
import { FaCopy, FaFile, FaFolder, FaSearch } from "react-icons/fa";
import { empty } from "util/function/function-util";

export const FOLDER_ICON = FaFolder;
export const PAGE_ICON = FaFile;
export const PAGE_MULTIPLE_ICON = FaCopy;
export const SEARCH_ICON = FaSearch;

type IconComponent =
  | typeof FaFolder
  | typeof FaFile
  | typeof FaCopy
  | typeof FaSearch;

export type IconProps = {
  icon: IconComponent;
  color: string;
  onClick?: () => void;
};

/** Displays an icon */
const Icon: FC<IconProps> = ({ icon, color, onClick = empty }) => {
  const InnerIcon = icon;
  return (
    <span onClick={onClick}>
      <InnerIcon color={color} style={{ fontSize: "3em" }} />
    </span>
  );
};

export default Icon;
