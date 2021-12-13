import type { LoDashImplicitArrayWrapper } from "lodash";
import _ from "lodash";

const performSort = <T, TSortReference>(
  getter: (value: T) => TSortReference,
  list: T[]
): LoDashImplicitArrayWrapper<number> =>
  _(list)
    .map((element, index): [TSortReference, number] => [getter(element), index])
    .sortBy((element) => element[0])
    .map((element) => element[1]);

export const indexSort = <T extends string, TSortReference>(
  getter: (value: T) => TSortReference,
  list: T[]
): number[] => performSort(getter, list).value();

export const indexSortReverse = <T extends string, TSortReference>(
  getter: (value: T) => TSortReference,
  list: T[]
): number[] => performSort(getter, list).reverse().value();
