import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Tag } from "../../../../../reducers/tags/tags-types";

export interface TagCellInputProps {
    availableTags: Tag[];
    createTag: (value: string, filesAndFoldersId: string) => void;
    nodeId: string;
}

type AutocompleteSimpleProps = Parameters<typeof Autocomplete>[0];

export const TagCellInput: React.FC<TagCellInputProps> = ({
    availableTags,
    createTag,
    nodeId,
}) => {
    const { t } = useTranslation();
    const [newTagName, setNewTagName] = useState("");

    const onInputChange: NonNullable<AutocompleteSimpleProps["onInputChange"]> =
        useCallback(
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

    const addTag: (newName: string) => void = useCallback(
        (newName) => {
            if (!newName || newName.length === 0) {
                return;
            }
            createTag(newName, nodeId);
            setNewTagName("");
        },
        [createTag, nodeId, setNewTagName]
    );

    const handleChange: NonNullable<AutocompleteSimpleProps["onChange"]> =
        useCallback(
            (event, newValue: { name: string }) => {
                addTag(newValue.name);
            },
            [addTag]
        ) as NonNullable<AutocompleteSimpleProps["onChange"]>;

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
            getOptionLabel={({ name }: { name?: string }) => name ?? ""}
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
