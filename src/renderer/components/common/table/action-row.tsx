import type { VoidFunction } from "@common/utils/function";
import { IconButton } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import type { ReactElement } from "react";
import React, { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaEye } from "react-icons/all";
import { useDispatch } from "react-redux";

import type { ElementWithToDelete } from "../../../reducers/files-and-folders/files-and-folders-types";
import {
  setHoveredElementId,
  setLockedElementId,
} from "../../../reducers/workspace-metadata/workspace-metadata-actions";
import { TabsContext } from "../../header/tabs-context";
import type { Column } from "./table-types";
import { TableValue } from "./table-value";

export interface ActionRowProps {
  columns: Column<ElementWithToDelete>[];
  row: ElementWithToDelete;
}

export function makeTableActionRow(
  closeModal: VoidFunction
): React.FC<ActionRowProps> {
  const TableActionRow = ({
    columns,
    row,
  }: ActionRowProps): ReactElement<ActionRowProps> => {
    const { t } = useTranslation();

    const { setTabIndex } = useContext(TabsContext);

    const dispatch = useDispatch();

    const setFocus = useCallback(
      (id: string) => dispatch(setHoveredElementId(id)),
      [dispatch]
    );

    const lock = useCallback(
      (id: string) => {
        dispatch(setLockedElementId(id));
      },
      [dispatch]
    );

    const onClick = useCallback(
      (id: string) => {
        setFocus(id);
        lock(id);
        setTabIndex(0);
        closeModal();
      },
      [setFocus, lock, setTabIndex]
    );

    const title = useMemo(() => t("search.visualizeElement"), [t]);

    return (
      <TableRow>
        {columns.map(({ id, cellStyle, accessor }, columnIndex) => {
          return (
            <TableCell key={`${id || accessor}-${columnIndex}`}>
              {id === "emptyColumn" ? (
                <Tooltip title={title}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      onClick(row.id);
                    }}
                  >
                    <FaEye />
                  </IconButton>
                </Tooltip>
              ) : (
                <TableValue
                  row={row}
                  accessor={accessor}
                  index={0}
                  cellStyle={cellStyle}
                />
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  return TableActionRow;
}
