import { IconButton } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import { Column } from "components/common/table/table-types";
import TableValue from "components/common/table/table-value";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaEye } from "react-icons/all";
import { useDispatch } from "react-redux";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import {
  setHoveredElementId,
  setLockedElementId,
} from "reducers/workspace-metadata/workspace-metadata-actions";

type ActionRowProps = {
  columns: Column<FilesAndFolders>[];
  row: FilesAndFolders;
};

export function makeTableActionRow(closeModal) {
  return function ({ columns, row }: ActionRowProps): ReactElement {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const setFocus = useCallback((id) => dispatch(setHoveredElementId(id)), [
      dispatch,
    ]);

    const lock = useCallback(
      (id) => {
        dispatch(setLockedElementId(id));
      },
      [dispatch]
    );

    const onClick = useCallback(
      (id) => {
        setFocus(id);
        lock(id);
        closeModal();
      },
      [setFocus, lock]
    );

    const title = useMemo(() => t("search.visualizeElement"), [t]);

    return (
      <TableRow>
        {columns.map(({ id }, columnIndex) => {
          const { accessor } = columns[columnIndex];
          return (
            <TableCell key={`${id || accessor}-${columnIndex}`}>
              {id === "emptyColumn" ? (
                <Tooltip title={title}>
                  <IconButton size="small" onClick={() => onClick(row.id)}>
                    <FaEye />
                  </IconButton>
                </Tooltip>
              ) : (
                <TableValue row={row} accessor={accessor} index={0} />
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };
}
