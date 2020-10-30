import { Column, TableAccessor } from "components/common/table/table-types";
import { arrayToCsv } from "util/csv/csv-util";
import { promises as fs } from "fs";
import {
  NotificationDuration,
  notifySuccess,
} from "util/notification/notifications-util";
import {
  openExternalElement,
  promptUserForSave,
} from "util/file-system/file-system-util";

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
  orderBy: (element: T) => any
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
) => {
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

export const accessorToFunction = <T>(tableAccessor: TableAccessor<T>) =>
  typeof tableAccessor === "function"
    ? tableAccessor
    : (row: T) => row[tableAccessor];

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
  columns.map(({ accessor }) =>
    applyAccessorToTableValue(data, accessor).toString()
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

type ExportTableToCsvOptions = {
  defaultFilePath: string;
  notificationTitle: string;
  notificationMessage: string;
};

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
) => {
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
      openExternalElement(filePath);
    }
  );
};

export const maxPage = (pageSize: number, dataSize: number) =>
  Math.max(0, Math.floor((dataSize - 1) / pageSize));

export const limitPageIndex = (
  pageSize: number,
  dataSize: number,
  currentPage: number
) => Math.min(currentPage, maxPage(pageSize, dataSize));
