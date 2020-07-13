import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tag } from "reducers/tags/tags-types";

type TagCellInputProps = {
  availableTags: Tag[];
  createTag: (value: string, filesAndFoldersId: string) => void;
  nodeId: string;
};

const TagCellInput: FC<TagCellInputProps> = ({
  availableTags,
  createTag,
  nodeId,
}) => {
  const { t } = useTranslation();
  const [newTagName, setNewTagName] = useState("");

  const onTextInput = useCallback(
    (event) => setNewTagName(event.target.value),
    [setNewTagName]
  );

  const addTag = useCallback(
    (newName) => {
      if (!newName || newName.length === 0) {
        return;
      }
      createTag(newName, nodeId);
      setNewTagName("");
    },
    [createTag, nodeId, setNewTagName]
  );

  const handleChange = useCallback(
    (event, newValue) => {
      addTag(newValue.name);
    },
    [addTag]
  );

  const onKeyDown = useCallback(
    ({ keyCode }) => {
      if (keyCode === 13) {
        addTag(newTagName);
      }
    },
    [addTag, newTagName]
  );

  return (
    <Autocomplete
      options={availableTags}
      getOptionLabel={({ name }) => name || ""}
      onChange={handleChange}
      blurOnSelect={true}
      disableClearable={true}
      clearOnEscape
      clearOnBlur
      fullWidth
      freeSolo
      noOptionsText={t("workspace.noOptions")}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("workspace.newTag")}
          margin="normal"
          onChange={onTextInput}
          onKeyDown={onKeyDown}
        />
      )}
    />
  );
};

export default TagCellInput;
