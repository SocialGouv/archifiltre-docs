import { ReactElement } from "react";

export type FunctionAccessor<T> = (value: T) => string | ReactElement;

export type Column<T> = {
  id?: string;
  name: string;
  accessor: string | FunctionAccessor<T>;
};

export type RowRenderer<T> = (rowValue: T) => ReactElement;

type RowIdAccessorFunction<T> = (row: T) => string;

export type RowIdAccessor<T> = string | RowIdAccessorFunction<T>;
