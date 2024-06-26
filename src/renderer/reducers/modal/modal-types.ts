export const OPEN_MODAL = "MODAL/OPEN_ERROR_MODAL";
export const CLOSE_MODAL = "MODAL/CLOSE_MODAL";

/* eslint-disable @typescript-eslint/naming-convention */
export enum Modal {
  ERROR_MODAL = "errorModal",
  FIlES_AND_FOLDERS_ERRORS_MODAL = "filesAndFoldersErrorModal",
  HASHES_ERROR_MODAL = "hashesErrorModal",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface ModalState {
  openModal: Modal | null;
}

export interface OpenErrorModalAction {
  modal: Modal;
  type: typeof OPEN_MODAL;
}

export interface CloseModalAction {
  type: typeof CLOSE_MODAL;
}

export type ModalAction = CloseModalAction | OpenErrorModalAction;
