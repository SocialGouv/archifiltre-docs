import React, { type ReactElement } from "react";

import { applyAccessorToTableValue } from "../../../utils/table";
import { type CellStyle, type TableAccessor, WordBreak } from "./table-types";

export interface TableValueProps<T> {
  accessor: TableAccessor<T>;
  cellStyle?: CellStyle;
  index?: number;
  row: T;
}

export const TableValue = <T,>({
  row,
  accessor,
  index,
  cellStyle = { wordBreak: WordBreak.NORMAL },
}: TableValueProps<T>): ReactElement<TableValueProps<T>> => {
  const value = applyAccessorToTableValue(row, accessor, index);

  return <span style={cellStyle}>{value}</span>;
};
