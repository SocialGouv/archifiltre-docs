import { createStyles, TableSortLabel } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { FC } from "react";
import { Order } from "util/table/table-util";

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

type EnhancedTableHeadProps = {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    columnIndex: number
  ) => void;
  order: Order;
  orderBy: number;
  columns;
};

const EnhancedTableHead: FC<EnhancedTableHeadProps> = ({
  columns,
  order,
  orderBy,
  onRequestSort,
}) => {
  const classes = useStyles();
  const createSortHandler = (columnIndex: number) => (
    event: React.MouseEvent
  ) => {
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
              onClick={createSortHandler(index)}
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

export default EnhancedTableHead;
