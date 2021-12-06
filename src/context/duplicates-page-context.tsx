import { noop } from "lodash";
import React, { createContext, useContext, useState } from "react";

interface DuplicatePageContextValues {
    pageIndex: number;
    rowsPerPage: number;
    setPageIndex: (pageIndex: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

const duplicatePageState: DuplicatePageContextValues = {
    pageIndex: 0,
    rowsPerPage: 10,
    setPageIndex: noop,
    setRowsPerPage: noop,
};

export const DuplicateContext =
    createContext<DuplicatePageContextValues>(duplicatePageState);

export const useDuplicatePageState = (): DuplicatePageContextValues => {
    const { pageIndex, rowsPerPage, setPageIndex, setRowsPerPage } =
        useContext(DuplicateContext);

    return { pageIndex, rowsPerPage, setPageIndex, setRowsPerPage };
};

export const DuplicatePageProvider: React.FC = ({ children }) => {
    const [pageIndex, setPageIndex] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    return (
        <DuplicateContext.Provider
            value={{
                pageIndex,
                rowsPerPage,
                setPageIndex,
                setRowsPerPage,
            }}
        >
            {children}
        </DuplicateContext.Provider>
    );
};
