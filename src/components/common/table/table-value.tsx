import React, { ReactElement } from "react";
import { TableAccessor } from "components/common/table/table-types";
import { applyAccessorToTableValue } from "util/table/table-util";

type TableValueProps<T> = {
  row: T;
  accessor: TableAccessor<T>;
  index?: number;
};

function TableValue<T>({
  row,
  accessor,
  index,
}: TableValueProps<T>): ReactElement {
  const value = applyAccessorToTableValue(row, accessor, index);

  return <span>{value}</span>;
}

export default TableValue;
