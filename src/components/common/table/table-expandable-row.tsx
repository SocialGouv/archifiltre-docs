import {
  RowRendererProps,
  TableAccessor,
} from "components/common/table/table-types";
import React, { ReactElement, useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableValue from "components/common/table/table-value";
import TableRow from "@material-ui/core/TableRow";
import Icon, { COLLAPSE_ICON, EXPAND_ICON } from "components/common/icon";

type HeaderProps<T> = { accessor: TableAccessor<T> }[];

export function makeTableExpandableRow<T>(headerProps: HeaderProps<T>) {
  return function ({ columns, row: rows }: RowRendererProps<T>): ReactElement {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => setExpanded(!expanded);
    const slicedColumns = columns.slice(1);
    return (
      <>
        <TableRow>
          <TableCell>
            <Icon
              icon={expanded ? COLLAPSE_ICON : EXPAND_ICON}
              color="black"
              onClick={toggleExpanded}
              size="normal"
            />
          </TableCell>
          {slicedColumns.map(({ id, cellStyle }, columnIndex) => {
            const { accessor } = headerProps[columnIndex];
            return (
              <TableCell key={`${id || accessor}-${columnIndex}`}>
                <TableValue
                  row={rows}
                  accessor={accessor}
                  index={0}
                  cellStyle={cellStyle}
                />
              </TableCell>
            );
          })}
        </TableRow>
        {expanded &&
          rows instanceof Array &&
          rows.map((row, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {columns.map(({ accessor, id, cellStyle }, columnIndex) => (
                <TableCell key={`${id || accessor}-${rowIndex}-${columnIndex}`}>
                  <TableValue
                    index={rowIndex}
                    row={rows}
                    accessor={columns[columnIndex].accessor}
                    cellStyle={cellStyle}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
      </>
    );
  };
}
