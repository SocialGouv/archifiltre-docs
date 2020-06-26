import React, { FC } from "react";

type TableValueProps = {
  row: any;
  column: any;
};

const TableValue: FC<TableValueProps> = ({ row, column }) => {
  const { accessor } = column;
  const value = typeof accessor === "string" ? row[accessor] : accessor(row);
  return <span>{value}</span>;
};

export default TableValue;
