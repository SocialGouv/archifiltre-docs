/* eslint-disable @typescript-eslint/naming-convention */
export const SET_ICICLE_SORT_METHOD =
  "WORKSPACE_METADATA/SET_ICICLE_SORT_METHOD";
export const SET_ELEMENT_WEIGHT_METHOD =
  "WORKSPACE_METADATA/SET_ELEMENT_WEIGHT_METHOD";
export const SET_ICICLE_COLOR_MODE = "WORKSPACE_METADATA/SET_ICICLE_COLOR_MODE";

export interface IcicleSortMethodState {
  icicleSortMethod: IcicleSortMethod;
  elementWeightMethod: ElementWeightMethod;
  icicleColorMode: IcicleColorMode;
}

export enum IcicleSortMethod {
  SORT_BY_SIZE = "bySize",
  SORT_BY_DATE = "byDate",
  SORT_ALPHA_NUMERICALLY = "alphaNumeric",
}

export enum ElementWeightMethod {
  BY_VOLUME = 0,
  BY_FILE_COUNT = 1,
}

export enum IcicleColorMode {
  BY_TYPE = 0,
  BY_DATE = 1,
}

interface SetIciclesSortMethod {
  type: typeof SET_ICICLE_SORT_METHOD;
  sortMethod: IcicleSortMethod;
}

interface SetElementWeightMethod {
  type: typeof SET_ELEMENT_WEIGHT_METHOD;
  weightMethod: ElementWeightMethod;
}

interface SetIcicleColorMode {
  colorMode: IcicleColorMode;
  type: typeof SET_ICICLE_COLOR_MODE;
}

export type IcicleSortMethodAction =
  | SetElementWeightMethod
  | SetIcicleColorMode
  | SetIciclesSortMethod;
