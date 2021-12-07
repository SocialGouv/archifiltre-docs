import React from "react";

import { ErrorsModalContainer as ErrorsModal } from "./errors-modal/errors-modal-container";
import { FilesAndFoldersErrorsModalContainer as FilesAndFoldersErrorsModal } from "./files-and-folders-errors-modal/files-and-folders-errors-container";
import { HashesErrorsModalContainer as HashesErrorsModal } from "./hashes-errors-modal/hashes-errors-container";

export const Modals: React.FC = () => (
    <>
        <ErrorsModal />
        <HashesErrorsModal />
        <FilesAndFoldersErrorsModal />
    </>
);
