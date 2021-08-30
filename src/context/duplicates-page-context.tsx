import React, { FC, useContext, useState } from "react";

type DuplicatePageContextValues = {
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
};

const duplicatePageState: DuplicatePageContextValues = {
  pageIndex: 0,
  setPageIndex: (pageIndex) => {},
};

export const DuplicateContext = React.createContext<DuplicatePageContextValues>(
  duplicatePageState
);

export const useDuplicatePageState = (): DuplicatePageContextValues => {
  const { pageIndex, setPageIndex } = useContext(DuplicateContext);

  return { pageIndex, setPageIndex };
};

const DuplicatePageProvider: FC = ({ children }) => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <DuplicateContext.Provider
      value={{
        pageIndex,
        setPageIndex,
      }}
    >
      {children}
    </DuplicateContext.Provider>
  );
};

export default DuplicatePageProvider;
