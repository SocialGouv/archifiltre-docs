import React, { useContext } from "react";

interface TabsContextValues {
    tabIndex: number;
    setTabIndex: (tabIndex: number) => void;
}

const tabsState: TabsContextValues = {
    setTabIndex: (tabIndex) => {},
    tabIndex: 0,
};

export const TabsContext = React.createContext<TabsContextValues>(tabsState);

export const useTabsState = (): TabsContextValues => {
    const { tabIndex, setTabIndex } = useContext(TabsContext);

    return { setTabIndex, tabIndex };
};
