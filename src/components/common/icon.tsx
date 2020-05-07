import React from "react";
import { FaCopy, FaFile, FaFolder, FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { empty } from "util/function/function-util";

export const FOLDER_ICON = FaFolder;
export const PAGE_ICON = FaFile;
export const PAGE_MULTIPLE_ICON = FaCopy;
export const SEARCH_ICON = FaSearch;

/** Displays an icon */
const Icon = ({ icon, color, onClick = empty }) => {
  const IconComponent = icon;
  return (
    <span onClick={onClick}>
      <IconComponent color={color} style={{ fontSize: "3em" }} />
    </span>
  );
};

export default Icon;
