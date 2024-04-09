import { StyledEngineProvider, type Theme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { Provider } from "react-redux";

import { AutoUpdateProvider } from "../../context/auto-update-context";
import { store } from "../../reducers/store";
import { defaultTheme } from "../../theme/default-theme";
import { ErrorBoundaryContainer } from "../errors/error-boundary-container";
import { TabsContext } from "../header/tabs-context";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

export const Providers: React.FC = ({ children }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={defaultTheme}>
          <ErrorBoundaryContainer>
            <AutoUpdateProvider>
              <TabsContext.Provider
                value={{
                  setTabIndex,
                  tabIndex,
                }}
              >
                {children}
              </TabsContext.Provider>
            </AutoUpdateProvider>
          </ErrorBoundaryContainer>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};
