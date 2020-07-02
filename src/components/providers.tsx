import { ThemeProvider } from "@material-ui/core/styles";
import ErrorBoundary from "components/errors/error-boundary-container";
import React, { FC, useState } from "react";
import { Provider } from "react-redux";
import { Store } from "reducers/real-estate-store";
import store from "reducers/store";
import defaultTheme from "theme/default-theme";
import { TabsContext } from "./header/dashboard/tabs-context";

const Providers: FC = ({ children }) => {
  const [areIciclesDisplayed, setAreIciclesDisplayed] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Store>
          {({ api }) => (
            <ErrorBoundary>
              <TabsContext.Provider
                value={{
                  areIciclesDisplayed,
                  tabIndex,
                  setAreIciclesDisplayed,
                  setTabIndex,
                }}
              >
                {typeof children === "function" ? children({ api }) : children}
              </TabsContext.Provider>
            </ErrorBoundary>
          )}
        </Store>
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
