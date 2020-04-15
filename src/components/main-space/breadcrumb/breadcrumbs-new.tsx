import React, { FC, memo, useMemo } from "react";
import styled from "styled-components";
import { FilesAndFolders } from "../../../reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadata } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { folder } from "../../../util/color-util";
import Breadcrumb from "./breadcrumb-new";
import { makeEmptyArray } from "../../../util/array-util";

const BreadcrumbsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

enum BreadcrumbOpacity {
  LOCKED = 1,
  HOVERED = 0.4,
}

interface BreadcrumbsProps {
  depth: number;
  lockedSequence: string[];
  getFfByFfId: (id: string) => FilesAndFolders & FilesAndFoldersMetadata;
}

const BreadcrumbsFillers = [];

const BreadcrumbsNew: FC<BreadcrumbsProps> = ({
  depth,
  lockedSequence,
  getFfByFfId,
}) => {
  const filesAndFolders = useMemo(
    () =>
      lockedSequence.map(getFfByFfId).map(({ id, name }, index) => ({
        id,
        color: folder(),
        isFirst: index === 0,
        isLast: index === lockedSequence.length - 1,
        label: name,
        opacity: BreadcrumbOpacity.LOCKED,
      })),
    [getFfByFfId, lockedSequence]
  );

  const fillerElements = makeEmptyArray(depth - filesAndFolders.length, null);
  return (
    <BreadcrumbsWrapper>
      {filesAndFolders.map(({ id, label, opacity, color, isFirst, isLast }) => (
        <div
          key={`breadcrumb-wrapper-${id}`}
          style={{ height: `${100 / depth}%` }}
        >
          <Breadcrumb
            key={`breadcrumb-${id}`}
            label={label}
            active={true}
            opacity={opacity}
            color={color}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>
      ))}
      {fillerElements.map((_, index) => (
        <div
          key={`breadcrumb-filler-${index}`}
          style={{ height: `${100 / depth}%` }}
        />
      ))}
    </BreadcrumbsWrapper>
  );
};

export default memo(BreadcrumbsNew);
