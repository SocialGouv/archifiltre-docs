import { TableAccessor } from "components/common/table/table-types";

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
