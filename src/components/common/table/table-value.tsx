import React, { ReactElement } from "react";
import {
  CellStyle,
  TableAccessor,
  WordBreak,
} from "components/common/table/table-types";
import { applyAccessorToTableValue } from "util/table/table-util";

type TableValueProps<T> = {
  row: T;
  accessor: TableAccessor<T>;
  index?: number;
  cellStyle?: CellStyle;
};

function TableValue<T>({
  row,
  accessor,
  index,
  cellStyle = { wordBreak: WordBreak.NORMAL },
}: TableValueProps<T>): ReactElement {
  const value = applyAccessorToTableValue(row, accessor, index);

  return <span style={cellStyle}>{value}</span>;
}

export default TableValue;
