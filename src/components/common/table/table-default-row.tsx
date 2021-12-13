import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

import type { RowRendererProps } from "./table-types";
import { TableValue } from "./table-value";

export const TableDefaultRow = <T,>({
  row,
  columns,
}: RowRendererProps<T>): React.ReactElement<RowRendererProps<T>> => {
  return (
    <TableRow>
      {columns.map(({ accessor, cellStyle, id }, columnIndex) => (
        <TableCell key={`${id || String(accessor)}-${columnIndex}`}>
          <TableValue row={row} accessor={accessor} cellStyle={cellStyle} />
        </TableCell>
      ))}
    </TableRow>
  );
};
