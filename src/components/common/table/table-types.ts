import type { ComponentType, ReactElement } from "react";

/* eslint-disable @typescript-eslint/naming-convention -- enum */
export enum WordBreak {
  NORMAL = "normal",
  BREAK_ALL = "break-all",
  BREAK_WORD = "break-word",
  KEEP_ALL = "keep-all",
}
/* eslint-enable @typescript-eslint/naming-convention */

export type FunctionAccessor<T> = (
  value: T,
  index?: number
) => ReactElement | number | string;

export type TableAccessor<T> = FunctionAccessor<T> | keyof T;

export interface CellStyle {
  wordBreak?: WordBreak;
}

export interface Column<T> {
  id: string;
  name: string;
  accessor: TableAccessor<T>;
  cellStyle?: CellStyle;
  sortAccessor?: TableAccessor<T>;
  textValueAccessor?: FunctionAccessor<unknown>;
  sortable?: boolean;
}

export type HeaderColumn<T> =
  | {
      accessor: keyof T;
    }
  | {
      id: string;
      accessor: FunctionAccessor<T>;
    };

export interface RowRendererProps<T> {
  columns: Column<T>[];
  row: T;
}

export type RowRenderer<T> = ComponentType<RowRendererProps<T>>;

type RowIdAccessorFunction<T> = (row: T) => string;

export type RowIdAccessor<T> = RowIdAccessorFunction<T> | keyof T;
