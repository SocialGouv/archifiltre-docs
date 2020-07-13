export const SET_ICICLE_SORT_METHOD =
  "WORKSPACE_METADATA/SET_ICICLE_SORT_METHOD";
export const SET_ELEMENT_WEIGHT_METHOD =
  "WORKSPACE_METADATA/SET_ELEMENT_WEIGHT_METHOD";
export const SET_ICICLE_COLOR_MODE = "WORKSPACE_METADATA/SET_ICICLE_COLOR_MODE";

export type IcicleSortMethodState = {
  icicleSortMethod: IcicleSortMethod;
  elementWeightMethod: ElementWeightMethod;
  icicleColorMode: IcicleColorMode;
};

export enum IcicleSortMethod {
  SORT_BY_SIZE = "bySize",
  SORT_BY_DATE = "byDate",
  SORT_ALPHA_NUMERICALLY = "alphaNumeric",
}

export enum ElementWeightMethod {
  BY_VOLUME,
  BY_FILE_COUNT,
}

export enum IcicleColorMode {
  BY_TYPE,
  BY_DATE,
}

type SetIciclesSortMethod = {
  type: typeof SET_ICICLE_SORT_METHOD;
  sortMethod: IcicleSortMethod;
};

type SetElementWeightMethod = {
  type: typeof SET_ELEMENT_WEIGHT_METHOD;
  weightMethod: ElementWeightMethod;
};

type SetIcicleColorMode = {
  colorMode: IcicleColorMode;
  type: typeof SET_ICICLE_COLOR_MODE;
};

export type IcicleSortMethodAction =
  | SetIciclesSortMethod
  | SetElementWeightMethod
  | SetIcicleColorMode;
