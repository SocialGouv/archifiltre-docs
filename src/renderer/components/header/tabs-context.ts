import { noop } from "lodash";
import { createContext, useContext } from "react";

export interface TabsContextValues {
  setTabIndex: (tabIndex: number) => void;
  tabIndex: number;
}

const tabsState: TabsContextValues = {
  setTabIndex: noop,
  tabIndex: 0,
};

export const TabsContext = createContext<TabsContextValues>(tabsState);

export const useTabsState = (): TabsContextValues => {
  const { tabIndex, setTabIndex } = useContext(TabsContext);

  return { setTabIndex, tabIndex };
};
