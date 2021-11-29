import type { TFunction } from "i18next";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type {
    AliasMap,
    FilesAndFolders,
} from "reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import styled from "styled-components";
import { makeEmptyArray } from "util/array/array-util";
import { placeholder } from "util/color/color-util";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";

import type { DimsAndId } from "../icicle/icicle-rect";
import type { FillColor } from "../icicle/icicle-types";
import Breadcrumb, { BreadcrumbOpacity } from "./breadcrumb";

const BreadcrumbsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

interface BreadcrumbWrapperProps {
    depth: number;
}

const BreadcrumbWrapper = styled.div<BreadcrumbWrapperProps>`
    height: ${({ depth }) => `${100 / depth}%`};
`;

interface BreadcrumbsProps {
    depth: number;
    lockedSequence: string[];
    hoveredSequence: string[];
    fillColor: FillColor;
    getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
    aliases: AliasMap;
    originalPath: string;
    onBreadcrumbClick: (dimsAndId: DimsAndId, event) => void;
}

interface MakeFillerArgs {
    id: string;
    name: string;
    alias: string | null;
    isFirst: boolean;
    isLast: boolean;
}

interface BreadcrumbProps {
    id: string;
    name: string;
    alias: string | null;
    opacity: BreadcrumbOpacity;
    color: string;
    isFirst: boolean;
    isLast: boolean;
    path: string;
    isActive: boolean;
}

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
    alias,
    color: placeholder(),
    id,
    isActive: false,
    isFirst,
    isLast,
    name,
    opacity: BreadcrumbOpacity.LOCKED,
    path: "",
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
        alias: null,
        id: "filler1",
        isFirst: true,
        isLast: depth === 1,
        name: "1",
    }),
    ...(depth > 2
        ? [
              makeFiller({
                  alias: null,
                  id: "filler2",
                  isFirst: false,
                  isLast: false,
                  name: "2",
              }),
          ]
        : []),
    ...(depth > 3
        ? [
              makeFiller({
                  alias: null,
                  id: "filler3",
                  isFirst: false,
                  isLast: false,
                  name: "...",
              }),
          ]
        : []),
    ...(depth > 4
        ? [
              makeFiller({
                  alias: null,
                  id: "filler4",
                  isFirst: false,
                  isLast: false,
                  name: "...",
              }),
          ]
        : []),
    ...(depth > 1
        ? [
              makeFiller({
                  alias: null,
                  id: "filler-file",
                  isFirst: false,
                  isLast: true,
                  name: t("workspace.file"),
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

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
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
            alias: aliases[node.id],
            color: fillColor(node.id),
            id: node.id,
            isActive: true,
            isFirst: index === 0,
            isLast: index === depth - 1,
            name: node.name,
            opacity:
                lockedSequence[index] === node.id
                    ? BreadcrumbOpacity.LOCKED
                    : BreadcrumbOpacity.HOVERED,
            path: getPathToCopy(originalPath, node.id),
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
        <div className="breadcrumbs">
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
                        <BreadcrumbWrapper
                            key={`breadcrumb-wrapper-${id}`}
                            depth={depth}
                        >
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
                    <BreadcrumbWrapper
                        key={`breadcrumb-filler-${index}`}
                        depth={depth}
                    />
                ))}
            </BreadcrumbsWrapper>
        </div>
    );
};

export default memo(Breadcrumbs);
