import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import React from "react";

import type { Order } from "../../../utils/table";
import type { Column } from "./table-types";

const useStyles = makeStyles(
  createStyles({
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

export interface EnhancedTableHeadProps<T> {
  columns: Column<T>[];
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    columnIndex: number
  ) => void;
  order: Order;
  orderBy: number;
}

export const EnhancedTableHead = <T,>({
  columns,
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableHeadProps<T>): React.ReactElement<
  EnhancedTableHeadProps<T>
> => {
  const classes = useStyles();
  const createSortHandler =
    (columnIndex: number) => (event: React.MouseEvent) => {
      onRequestSort(event, columnIndex);
    };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column, index) => (
          <TableCell
            key={column.id}
            sortDirection={orderBy === index ? order : false}
          >
            <TableSortLabel
              active={orderBy === index}
              direction={orderBy === index ? order : "asc"}
              onClick={column.sortable ? createSortHandler(index) : undefined}
              hideSortIcon={!column.sortable}
            >
              {column.name}
              {orderBy === index ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
