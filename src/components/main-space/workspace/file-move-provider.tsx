import React, { FC, useCallback, useContext, useState } from "react";

const fileMoveState = {
  isFileMoveActive: false,
  setIsFileMoveActive: (isMoveActive) => {},
};

const FileMoveContext = React.createContext(fileMoveState);

export const useFileMoveActiveState = () => {
  const { isFileMoveActive, setIsFileMoveActive } = useContext(FileMoveContext);
  const setFileMoveActive = useCallback(
    (isMoveActive) => setIsFileMoveActive(isMoveActive),
    [setIsFileMoveActive]
  );
  return { isFileMoveActive, setFileMoveActive };
};

const FileMoveProvider: FC = ({ children }) => {
  const [isFileMoveActive, setIsFileMoveActive] = useState(false);

  return (
    <FileMoveContext.Provider
      value={{
        isFileMoveActive,
        setIsFileMoveActive,
      }}
    >
      {children}
    </FileMoveContext.Provider>
  );
};

export default FileMoveProvider;
