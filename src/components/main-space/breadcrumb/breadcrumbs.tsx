import { TFunction } from "i18next";
import React, { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  AliasMap,
  FilesAndFolders,
} from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import Breadcrumb, { BreadcrumbOpacity } from "./breadcrumb";
import { makeEmptyArray } from "util/array/array-util";
import { FillColor } from "../icicle/icicle-types";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";
import { DimsAndId } from "../icicle/icicle-rect";
import { placeholder } from "util/color/color-util";

const BreadcrumbsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

type BreadcrumbWrapperProps = {
  depth: number;
};

const BreadcrumbWrapper = styled.div<BreadcrumbWrapperProps>`
  height: ${({ depth }) => `${100 / depth}%`};
`;

type BreadcrumbsProps = {
  depth: number;
  lockedSequence: string[];
  hoveredSequence: string[];
  fillColor: FillColor;
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
  aliases: AliasMap;
  originalPath: string;
  onBreadcrumbClick: (dimsAndId: DimsAndId, event) => void;
};

type MakeFillerArgs = {
  id: string;
  name: string;
  alias: string | null;
  isFirst: boolean;
  isLast: boolean;
};

type BreadcrumbProps = {
  id: string;
  name: string;
  alias: string | null;
  opacity: BreadcrumbOpacity;
  color: string;
  isFirst: boolean;
  isLast: boolean;
  path: string;
  isActive: boolean;
};

/**
 * Create a filler Breadcrumb, used when nothing is locked or focused
 * @param id
 * @param name
 * @param alias
 * @param isFirst
 * @param isLast
 */
const makeFiller = ({
  id,
  name,
  alias,
  isFirst,
  isLast,
}: MakeFillerArgs): BreadcrumbProps => ({
  id,
  name,
  alias,
  isFirst,
  isLast,
  opacity: BreadcrumbOpacity.LOCKED,
  color: placeholder(),
  path: "",
  isActive: false,
});

/**
 * Create a list of filler Breadcrumbs with the right depth, used when nothing is locked or focused
 * @param depth - breadcrumbs depth
 * @param t - translation function
 */
const makeBreadcrumbsFillers = (
  depth: number,
  t: TFunction
): BreadcrumbProps[] => [
  makeFiller({
    id: "filler1",
    name: "1",
    alias: null,
    isFirst: true,
    isLast: depth === 1,
  }),
  ...(depth > 2
    ? [
        makeFiller({
          id: "filler2",
          name: "2",
          alias: null,
          isFirst: false,
          isLast: false,
        }),
      ]
    : []),
  ...(depth > 3
    ? [
        makeFiller({
          id: "filler3",
          name: "...",
          alias: null,
          isFirst: false,
          isLast: false,
        }),
      ]
    : []),
  ...(depth > 4
    ? [
        makeFiller({
          id: "filler4",
          name: "...",
          alias: null,
          isFirst: false,
          isLast: false,
        }),
      ]
    : []),
  ...(depth > 1
    ? [
        makeFiller({
          id: "filler-file",
          name: t("workspace.file"),
          alias: null,
          isFirst: false,
          isLast: true,
        }),
      ]
    : []),
];

/**
 * Returns the absolute path of the corresponding file
 * @param originalPath
 * @param nodeId
 */
const getPathToCopy = (originalPath: string, nodeId: string) => {
  const basePath = originalPath.substring(0, originalPath.lastIndexOf("/"));
  return formatPathForUserSystem(`${basePath}/${nodeId}`);
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({
  depth,
  lockedSequence,
  hoveredSequence,
  fillColor,
  getFfByFfId,
  aliases,
  originalPath,
  onBreadcrumbClick,
}) => {
  const { t } = useTranslation();
  const fillers = useMemo(() => makeBreadcrumbsFillers(depth, t), [depth]);
  const filesAndFolders: BreadcrumbProps[] = useMemo(() => {
    if (hoveredSequence.length === 0 && lockedSequence.length === 0) {
      return fillers;
    }
    const sequence =
      hoveredSequence.length > 0 ? hoveredSequence : lockedSequence;
    return sequence.map(getFfByFfId).map((node, index) => ({
      id: node.id,
      color: fillColor(node.id),
      isFirst: index === 0,
      isLast: index === depth - 1,
      isActive: true,
      name: node.name,
      alias: aliases[node.id],
      path: getPathToCopy(originalPath, node.id),
      opacity:
        lockedSequence[index] === node.id
          ? BreadcrumbOpacity.LOCKED
          : BreadcrumbOpacity.HOVERED,
    }));
  }, [
    getFfByFfId,
    fillColor,
    depth,
    aliases,
    originalPath,
    hoveredSequence,
    lockedSequence,
    fillers,
  ]);

  const fillerElements = makeEmptyArray(depth - filesAndFolders.length, null);
  return (
    <BreadcrumbsWrapper>
      {filesAndFolders.map(
        ({
          id,
          name,
          alias,
          opacity,
          color,
          isActive,
          isFirst,
          isLast,
          path,
        }) => (
          <BreadcrumbWrapper key={`breadcrumb-wrapper-${id}`} depth={depth}>
            <Breadcrumb
              id={id}
              key={`breadcrumb-${id}`}
              name={name}
              alias={alias}
              path={path}
              active={isActive}
              opacity={opacity}
              color={color}
              isFirst={isFirst}
              isLast={isLast}
              onBreadcrumbClick={onBreadcrumbClick}
            />
          </BreadcrumbWrapper>
        )
      )}
      {fillerElements.map((_, index) => (
        <BreadcrumbWrapper key={`breadcrumb-filler-${index}`} depth={depth} />
      ))}
    </BreadcrumbsWrapper>
  );
};

export default memo(Breadcrumbs);
