import { ThemeProvider } from "@material-ui/core/styles";
import ErrorBoundary from "components/errors/error-boundary-container";
import React, { FC, useState } from "react";
import { Provider } from "react-redux";
import store from "reducers/store";
import defaultTheme from "theme/default-theme";
import { TabsContext } from "../header/tabs-context";

const Providers: FC = ({ children }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <ErrorBoundary>
          <TabsContext.Provider
            value={{
              tabIndex,
              setTabIndex,
            }}
          >
            {children}
          </TabsContext.Provider>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
