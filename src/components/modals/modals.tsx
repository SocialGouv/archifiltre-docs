import React, { FC } from "react";
import ErrorsModal from "./errors-modal/errors-modal-container";
import HashesErrorsModal from "components/modals/hashes-errors-modal/hashes-errors-container";

const Modals: FC = () => (
  <>
    <ErrorsModal />
    <HashesErrorsModal />
  </>
);

export default Modals;
