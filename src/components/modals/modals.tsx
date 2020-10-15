import React, { FC } from "react";
import ErrorsModal from "./errors-modal/errors-modal-container";
import HashesErrorsModal from "components/modals/hashes-errors-modal/hashes-errors-container";
import FilesAndFoldersErrorsModal from "components/modals/files-and-folders-errors-modal/files-and-folders-errors-container";

const Modals: FC = () => (
  <>
    <ErrorsModal />
    <HashesErrorsModal />
    <FilesAndFoldersErrorsModal />
  </>
);

export default Modals;
