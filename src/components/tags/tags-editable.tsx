import React, { FC, useCallback, useEffect, useRef } from "react";
import Tag from "components/tags/tag";
import { useTranslation } from "react-i18next";
import { empty } from "util/function/function-util";
import MarkToDeleteButton from "./mark-to-delete-button";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";

const Input = styled.input`
  width: 7em;
  border: none;
  background: none;
  outline: none;
  border-bottom: 3px solid rgb(10, 50, 100);
`;

const CellShrink = styled(Grid)`
  padding: 0.3em;
`;

interface TagsEditableProps {
  tagsForCurrentFile;
  editing;
  isLocked;
  isCurrentFileMarkedToDelete;
  candidate_tag;
  onChange;
  onKeyUp;
  removeHandlerFactory;
  toggleCurrentFileDeleteState;
}

const TagsEditable: FC<TagsEditableProps> = ({
  tagsForCurrentFile,
  editing,
  isLocked,
  isCurrentFileMarkedToDelete,
  candidate_tag,
  onChange,
  onKeyUp,
  removeHandlerFactory,
  toggleCurrentFileDeleteState,
}) => {
  const { t } = useTranslation();

  const textInputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textInputElement && textInputElement.current) {
      textInputElement.current.focus();
    }
  });

  const tagsToElements = useCallback(
    () =>
      tagsForCurrentFile
        .map((tag) => (
          <CellShrink key={tag.id}>
            <Tag
              text={tag.name}
              editing={editing}
              removeHandler={removeHandlerFactory(tag.id)}
              custom_style=""
              clickHandler={empty}
            />
          </CellShrink>
        ))
        .reduce((accumulator, value) => [...accumulator, value], []),
    [tagsForCurrentFile, editing, removeHandlerFactory]
  );

  let answer;

  if (editing) {
    const elements = tagsToElements();
    const inputBox = (
      <CellShrink key="__input__">
        <Input
          onMouseUp={(event) => {
            event.stopPropagation();
          }}
          onKeyUp={onKeyUp}
          placeholder={t("workspace.newTag")}
          ref={textInputElement}
          value={candidate_tag}
          onChange={onChange}
        />
      </CellShrink>
    );

    answer = [...elements, inputBox];
  } else if (tagsForCurrentFile.length > 0) {
    answer = tagsToElements();
  } else {
    answer = (
      <CellShrink item key="__closing__">
        <span>{t("workspace.clickHereToAddTags")}</span>
      </CellShrink>
    );
  }

  return (
    <Grid container>
      {(isLocked || isCurrentFileMarkedToDelete) && (
        <MarkToDeleteButton
          isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
          onClick={toggleCurrentFileDeleteState}
        />
      )}
      {answer}
    </Grid>
  );
};

export default TagsEditable;
