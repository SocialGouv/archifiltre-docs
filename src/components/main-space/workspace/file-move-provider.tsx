import { noop } from "lodash";
import React, { createContext, useCallback, useContext, useState } from "react";

interface FileMoveState {
    isFileMoveActive: boolean;
    setIsFileMoveActive: (isMoveActive: boolean) => void;
}
const fileMoveState: FileMoveState = {
    isFileMoveActive: false,
    setIsFileMoveActive: noop,
};

const FileMoveContext = createContext(fileMoveState);

export const useFileMoveActiveState = (): FileMoveState => {
    const { isFileMoveActive, setIsFileMoveActive } =
        useContext(FileMoveContext);
    const setIsFileMoveActiveCallback: FileMoveState["setIsFileMoveActive"] =
        useCallback(
            (isMoveActive) => {
                setIsFileMoveActive(isMoveActive);
            },
            [setIsFileMoveActive]
        );
    return {
        isFileMoveActive,
        setIsFileMoveActive: setIsFileMoveActiveCallback,
    };
};

export const FileMoveProvider: React.FC = ({ children }) => {
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
