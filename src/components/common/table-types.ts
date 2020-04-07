import {
  ColumnInstance,
  TableInstance,
  TableState,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByColumnProps,
  UseSortByInstanceProps,
  UseSortByState,
} from "react-table";

export type AggregatedTableInstance<Type extends object> = TableInstance<Type> &
  UsePaginationInstanceProps<Type> &
  UseSortByInstanceProps<Type>;

export type AggregatedTableState<Type extends object> = TableState<Type> &
  UsePaginationState<Type> &
  UseSortByState<Type>;

export type AggregatedColumn<Type extends object> = ColumnInstance<Type> &
  UseSortByColumnProps<Type>;
