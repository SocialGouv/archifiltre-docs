import React, { useContext } from "react";

type TabsContextValues = {
  areIciclesDisplayed: boolean;
  tabIndex: number;
  setAreIciclesDisplayed: (areIciclesDisplayed: boolean) => void;
  setTabIndex: (tabIndex: number) => void;
};

const tabsState: TabsContextValues = {
  areIciclesDisplayed: true,
  tabIndex: 0,
  setAreIciclesDisplayed: (areIciclesDisplayed) => {},
  setTabIndex: (tabIndex) => {},
};

export const TabsContext = React.createContext<TabsContextValues>(tabsState);

export const useTabsState = (): TabsContextValues => {
  const {
    areIciclesDisplayed,
    setAreIciclesDisplayed,
    tabIndex,
    setTabIndex,
  } = useContext(TabsContext);

  return { areIciclesDisplayed, setAreIciclesDisplayed, tabIndex, setTabIndex };
};
