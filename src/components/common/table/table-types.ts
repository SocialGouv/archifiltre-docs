import { ComponentType, ReactElement } from "react";

export type FunctionAccessor<T> = (
  value: T,
  index?: number
) => string | ReactElement;

export type TableAccessor<T> = string | FunctionAccessor<T>;

export type Column<T> = {
  id?: string;
  name: string;
  accessor: TableAccessor<T>;
};

export type RowRendererProps<T> = {
  columns: Column<T>[];
  row: T;
};

export type RowRenderer<T> = ComponentType<RowRendererProps<T>>;

type RowIdAccessorFunction<T> = (row: T) => string;

export type RowIdAccessor<T> = string | RowIdAccessorFunction<T>;
