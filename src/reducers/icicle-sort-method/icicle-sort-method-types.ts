export const SET_ICICLE_SORT_METHOD =
  "WORKSPACE_METADATA/SET_ICICLE_SORT_METHOD";

export type IcicleSortMethodState = {
  icicleSortMethod: IcicleSortMethod;
};

export enum IcicleSortMethod {
  SORT_BY_TYPE = "byType",
  SORT_BY_DATE = "byDate",
  SORT_ALPHA_NUMERICALLY = "alphaNumeric",
}

export type SetIciclesSortMethod = {
  type: typeof SET_ICICLE_SORT_METHOD;
  sortMethod: IcicleSortMethod;
};

export type IcicleSortMethodAction = SetIciclesSortMethod;
