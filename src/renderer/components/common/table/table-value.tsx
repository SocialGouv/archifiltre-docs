import type { ReactElement } from "react";
import React from "react";

import { applyAccessorToTableValue } from "../../../utils/table";
import type { CellStyle, TableAccessor } from "./table-types";
import { WordBreak } from "./table-types";

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
