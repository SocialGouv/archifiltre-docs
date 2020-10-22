import React, { ReactElement } from "react";
import { RowRendererProps } from "components/common/table/table-types";
import TableCell from "@material-ui/core/TableCell";
import TableValue from "components/common/table/table-value";
import TableRow from "@material-ui/core/TableRow";

const TableDefaultRow = function <T>({
  row,
  columns,
}: RowRendererProps<T>): ReactElement {
  return (
    <TableRow>
      {columns.map(({ accessor, cellStyle, id }, columnIndex) => (
        <TableCell key={`${id || accessor}-${columnIndex}`}>
          <TableValue
            row={row}
            accessor={columns[columnIndex].accessor}
            cellStyle={cellStyle}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableDefaultRow;
