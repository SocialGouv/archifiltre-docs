import { ComponentType, ReactElement } from "react";

export enum WordBreak {
  NORMAL = "normal",
  BREAK_ALL = "break-all",
  BREAK_WORD = "break-word",
  KEEP_ALL = "keep-all",
}

export type FunctionAccessor<T> = (
  value: T,
  index?: number
) => string | ReactElement;

export type TableAccessor<T> = keyof T | FunctionAccessor<T>;

export type CellStyle = {
  wordBreak?: WordBreak;
};

export type Column<T> = {
  id: string;
  name: string;
  accessor: TableAccessor<T>;
  cellStyle?: CellStyle;
};

export type HeaderColumn<T> =
  | {
      id: string;
      accessor: FunctionAccessor<T>;
    }
  | {
      accessor: keyof T;
    };

export type RowRendererProps<T> = {
  columns: Column<T>[];
  row: T;
};

export type RowRenderer<T> = ComponentType<RowRendererProps<T>>;

type RowIdAccessorFunction<T> = (row: T) => keyof T;

export type RowIdAccessor<T> = keyof T | RowIdAccessorFunction<T>;
