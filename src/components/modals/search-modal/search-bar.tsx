import InputAdornment from "@material-ui/core/InputAdornment";
import InputBase from "@material-ui/core/InputBase";
import { useStyles } from "hooks/use-styles";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

const handleTracking = (searchTerm) => {
    if (searchTerm.length !== 0) {
        addTracker({
            title: ActionTitle.SEARCH_PERFORMED,
            type: ActionType.TRACK_EVENT,
        });
    }
};

interface SearchBarProps {
    value: string;
    setSearchTerm: (searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    setSearchTerm,
    value,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const onChange = useCallback(
        (event) => {
            setSearchTerm(event.target.value);
            handleTracking(event.target.value);
        },
        [setSearchTerm]
    );

    return (
        <InputBase
            fullWidth
            margin="dense"
            className={classes.searchInput}
            type="search"
            placeholder={t("search.searchPlaceholder")}
            onChange={onChange}
            value={value}
            startAdornment={
                <InputAdornment position="start">
                    <FaSearch />
                </InputAdornment>
            }
        />
    );
};
