// Enables reporter to hook into the environment so it captures uncaught errors
import "./logging/reporter.ts";

import "./css/index.scss";
import "css/app.css";

import { SecretDevtools } from "secret-devtools";
import React from "react";
import ReactDOM from "react-dom";

import ErrorBoundary from "components/errors/error-boundary-container";
import MainSpace from "components/main-space/main-space";
import Header from "components/header/header.tsx";
import { NewVersionChecker } from "components/header/new-version-checker";
import WindowResize from "components/common/window-resize-handler";

import { Store } from "reducers/real-estate-store";
import { Provider } from "react-redux";
import store from "reducers/store.ts";

import version from "version.ts";

import { NotificationContainer } from "react-notifications";
import { initTracker } from "./logging/tracker.ts";
import "./translations/translations";
import BackgroundLoadingInfoContainer from "./components/background-loading-info/background-loading-info-container";
import Modal from "react-modal";
import Modals from "./components/modals/modals";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";

document.title = `Archifiltre v${version}`;

SecretDevtools.enable();
initTracker();

const App = styled.div`
  padding: 0.975em;
  height: 100vh;
`;

/**This is the entrypoint for the app. */
const app = () => {
  const rootDiv = document.createElement("div");
  rootDiv.setAttribute("id", "root");

  if (document.body !== null) {
    document.body.appendChild(rootDiv);
  }
  Modal.setAppElement("#root");

  ReactDOM.render(
    <Provider store={store}>
      <Store>
        {({ api }) => {
          return (
            <ErrorBoundary api={api}>
              <WindowResize />
              <App>
                <Grid container spacing={1} height="100%">
                  <Grid item xs={12}>
                    <NewVersionChecker />
                  </Grid>
                  <Grid item xs={12}>
                    <Header api={api} />
                  </Grid>
                  <Grid item xs={12}>
                    <MainSpace api={api} />
                  </Grid>
                  <BackgroundLoadingInfoContainer />
                </Grid>
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
