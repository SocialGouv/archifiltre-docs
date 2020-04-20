import _, { LoDashImplicitArrayWrapper } from "lodash";

const performSort = <Type>(
  getter: (value: Type) => number,
  list: any[]
): LoDashImplicitArrayWrapper<number> =>
  _(list)
    .map((element, index) => [getter(element), index])
    .sortBy((element) => element[0])
    .map((element) => element[1]);

export const indexSort = <Type>(
  getter: (value: Type) => number,
  list: string[]
): number[] => performSort(getter, list).value();

export const indexSortReverse = <Type>(
  getter: (value: Type) => number,
  list: string[]
): number[] => performSort(getter, list).reverse().value();
