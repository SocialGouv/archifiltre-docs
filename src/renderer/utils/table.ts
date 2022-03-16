import { arrayToCsv } from "@common/utils/csv";
import fs from "fs/promises";

import type {
  Column,
  FunctionAccessor,
  TableAccessor,
} from "../components/common/table/table-types";
import {
  openExternalElement,
  promptUserForSave,
} from "./file-system/file-system-util";
import { NotificationDuration, notifySuccess } from "./notifications";

export type Order = "asc" | "desc";

const sanitizeComparedElement = <T>(comparedElement: T) =>
  typeof comparedElement === "string"
    ? comparedElement.toLowerCase()
    : comparedElement;

const descendingComparator = <T>(firstElement: T, secondElement: T) => {
  const sanitizedFirstElement = sanitizeComparedElement(firstElement);
  const sanitizedSecondElement = sanitizeComparedElement(secondElement);
  if (sanitizedSecondElement < sanitizedFirstElement) {
    return -1;
  }
  if (sanitizedSecondElement > sanitizedFirstElement) {
    return 1;
  }
  return 0;
};

export const getComparator = <T>(
  order: Order,
  orderBy: (element: T) => unknown
): ((firstElement: T, secondElement: T) => number) => {
  return order === "desc"
    ? (firstElement, secondElement) =>
        descendingComparator(orderBy(firstElement), orderBy(secondElement))
    : (firstElement, secondElement) =>
        -descendingComparator(orderBy(firstElement), orderBy(secondElement));
};

export const stableSort = <T>(
  array: T[],
  comparator: (firstElement: T, secondElement: T) => number
): T[] => {
  const stabilizedThis = array.map(
    (element, index) => [element, index] as [T, number]
  );
  stabilizedThis.sort((firstElement, secondElement) => {
    const order = comparator(firstElement[0], secondElement[0]);
    if (order !== 0) {
      return order;
    }
    return firstElement[1] - secondElement[1];
  });
  return stabilizedThis.map((element) => element[0]);
};

export const accessorToFunction = <T>(
  tableAccessor: TableAccessor<T>
): FunctionAccessor<T> | ((row: T) => T[keyof T]) =>
  typeof tableAccessor === "function"
    ? tableAccessor
    : (row: T) => row[tableAccessor];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const applyAccessorToTableValue = <T>(
  data: T,
  accessor: TableAccessor<T>,
  index = 0
) => (typeof accessor === "function" ? accessor(data, index) : data[accessor]);

const getTableHeaderFromColumns = <T>(columns: Column<T>[]) =>
  columns.map((column) => column.name);

const getTableRow = <
  T extends { [key in keyof T]: { toString: () => string } }
>(
  data: T,
  columns: Column<T>[]
): string[] =>
  columns.map(({ accessor, textValueAccessor }) =>
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    applyAccessorToTableValue<T>(data, textValueAccessor ?? accessor).toString()
  );

const getTableContent = <
  T extends { [key in keyof T]: { toString: () => string } }
>(
  data: T[],
  columns: Column<T>[]
) => data.map((rowData) => getTableRow(rowData, columns));

export const tableContentToArray = <
  T extends { [key in keyof T]: { toString: () => string } }
>(
  data: T[],
  columns: Column<T>[]
): string[][] => [
  getTableHeaderFromColumns(columns),
  ...getTableContent(data, columns),
];

interface ExportTableToCsvOptions {
  defaultFilePath: string;
  notificationTitle: string;
  notificationMessage: string;
}

export const exportTableToCsvFile = async <
  T extends { [key in keyof T]: { toString: () => string } }
>(
  data: T[],
  columns: Column<T>[],
  {
    defaultFilePath,
    notificationMessage,
    notificationTitle,
  }: ExportTableToCsvOptions
): Promise<void> => {
  const filePath = await promptUserForSave(defaultFilePath);

  if (!filePath) {
    return;
  }

  const arrayContent = tableContentToArray(data, columns);
  const csvContent = arrayToCsv(arrayContent);

  await fs.writeFile(filePath, csvContent);

  notifySuccess(
    notificationMessage,
    notificationTitle,
    NotificationDuration.NORMAL,
    () => {
      void openExternalElement(filePath);
    }
  );
};

export const maxPage = (pageSize: number, dataSize: number): number =>
  Math.max(0, Math.floor((dataSize - 1) / pageSize));

export const limitPageIndex = (
  pageSize: number,
  dataSize: number,
  currentPage: number
): number => Math.min(currentPage, maxPage(pageSize, dataSize));
