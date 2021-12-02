import FilesAndFoldersErrorsModal from "components/modals/files-and-folders-errors-modal/files-and-folders-errors-container";
import HashesErrorsModal from "components/modals/hashes-errors-modal/hashes-errors-container";
import React from "react";

import ErrorsModal from "./errors-modal/errors-modal-container";

const Modals: React.FC = () => (
    <>
        <ErrorsModal />
        <HashesErrorsModal />
        <FilesAndFoldersErrorsModal />
    </>
);

export default Modals;
