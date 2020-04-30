// Enables reporter to hook into the environment so it captures uncaught errors
import "logging/reporter.ts";

import "./css/index.scss";
import "css/app.css";

import { SecretDevtools } from "secret-devtools";
import React from "react";
import ReactDOM from "react-dom";

import ErrorBoundary from "components/errors/error-boundary-container";
import MainSpace from "components/main-space/main-space";
import Header from "components/header/header";
import { NewVersionChecker } from "components/header/new-version-checker";
import WindowResize from "components/common/window-resize-handler";

import { Store } from "reducers/real-estate-store";
import { Provider } from "react-redux";
import store from "reducers/store";

import version from "version";

import { NotificationContainer } from "react-notifications";
import { initTracker } from "logging/tracker";
import "translations/translations";
import BackgroundLoadingInfoContainer from "components/background-loading-info/background-loading-info-container";
import Box from "@material-ui/core/Box";
import styled from "styled-components";
import Modals from "components/modals/modals";

document.title = `Archifiltre v${version}`;

SecretDevtools.enable();
initTracker();

const App = styled.div`
  padding: 0.975em;
  height: 100vh;
  box-sizing: border-box;
`;

/** This is the entrypoint for the app. */
const app = () => {
  const rootDiv = document.createElement("div");
  rootDiv.setAttribute("id", "root");

  if (document.body !== null) {
    document.body.appendChild(rootDiv);
  }

  ReactDOM.render(
    <Provider store={store}>
      <Store>
        {({ api }) => {
          return (
            <ErrorBoundary>
              <WindowResize />
              <App>
                <Box
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  width="100%"
                >
                  <Box>
                    <Header api={api} />
                  </Box>
                  <Box flexGrow={1} flexShrink={1}>
                    <MainSpace api={api} />
                  </Box>
                  <BackgroundLoadingInfoContainer />
                </Box>
                <NewVersionChecker />
              </App>
              <NotificationContainer />
              <Modals />
            </ErrorBoundary>
          );
        }}
      </Store>
    </Provider>,
    rootDiv
  );
};

window.addEventListener("load", app);

document.ondragover = document.ondrop = (event) => {
  event.preventDefault();
  return false;
};

window.ondragover = window.ondrop = (event) => {
  event.preventDefault();
  return false;
};
