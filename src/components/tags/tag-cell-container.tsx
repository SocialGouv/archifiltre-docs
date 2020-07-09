import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { Tag } from "reducers/tags/tags-types";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import TagCell from "./tag-cell";

type TagCellContainerProps = {
  isActive: boolean;
  isCurrentFileMarkedToDelete: boolean;
  nodeId: string;
  tagsForCurrentFile: Tag[];
  createTag: (value: string, filesAndFoldersId: string) => void;
  untag: (tagId: string, nodeId: string) => void;
  toggleCurrentFileDeleteState: () => void;
};

const TagCellContainer: FC<TagCellContainerProps> = ({
  isActive,
  isCurrentFileMarkedToDelete,
  nodeId,
  tagsForCurrentFile,
  createTag,
  untag,
  toggleCurrentFileDeleteState,
}) => {
  const allTags = useSelector(getTagsFromStore);

  const availableTags = useMemo(
    () =>
      Object.values(allTags).filter(
        (allTag) =>
          !tagsForCurrentFile.some(
            (tagForCurrentFile) => allTag.name === tagForCurrentFile.name
          )
      ),
    [tagsForCurrentFile, allTags]
  );

  return (
    <TagCell
      isActive={isActive}
      isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
      nodeId={nodeId}
      tagsForCurrentFile={tagsForCurrentFile}
      createTag={createTag}
      untag={untag}
      toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
      availableTags={availableTags}
    />
  );
};

export default TagCellContainer;
