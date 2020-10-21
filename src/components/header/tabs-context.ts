import React, { useContext } from "react";

type TabsContextValues = {
  tabIndex: number;
  setTabIndex: (tabIndex: number) => void;
};

const tabsState: TabsContextValues = {
  tabIndex: 0,
  setTabIndex: (tabIndex) => {},
};

export const TabsContext = React.createContext<TabsContextValues>(tabsState);

export const useTabsState = (): TabsContextValues => {
  const { tabIndex, setTabIndex } = useContext(TabsContext);

  return { tabIndex, setTabIndex };
};
