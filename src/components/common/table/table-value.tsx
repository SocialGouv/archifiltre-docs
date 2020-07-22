import React, { ReactElement } from "react";
import { TableAccessor } from "components/common/table/table-types";

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
  const value =
    typeof accessor === "function" ? accessor(row, index) : row[accessor];

  return <span>{value}</span>;
}

export default TableValue;
