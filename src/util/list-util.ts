import _, { LoDashImplicitArrayWrapper } from "lodash";

const performSort = <Type, SortReferenceType>(
  getter: (value: Type) => SortReferenceType,
  list: any[]
): LoDashImplicitArrayWrapper<number> =>
  _(list)
    .map((element, index): [SortReferenceType, number] => [
      getter(element),
      index,
    ])
    .sortBy((element) => element[0])
    .map((element) => element[1]);

export const indexSort = <Type, SortReferenceType>(
  getter: (value: Type) => SortReferenceType,
  list: string[]
): number[] => performSort(getter, list).value();

export const indexSortReverse = <Type, SortReferenceType>(
  getter: (value: Type) => SortReferenceType,
  list: string[]
): number[] => performSort(getter, list).reverse().value();
