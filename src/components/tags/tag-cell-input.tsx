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

  const onInputChange = useCallback(
    (event, value, reason) => {
      // We do not update the state when the input value changes programmatically as
      // the inputChange event occurs after the autocomplete change event, preventing us from
      // resetting the input value
      if (reason !== "reset") {
        setNewTagName(value);
      }
    },
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
    ({ key }) => {
      if (key === "Enter") {
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
      inputValue={newTagName}
      onInputChange={onInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("workspace.newTag")}
          margin="normal"
          onKeyDown={onKeyDown}
        />
      )}
    />
  );
};

export default TagCellInput;
