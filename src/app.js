// Enables reporter to hook into the environment so it captures uncaught errors
import "./logging/reporter.ts";

import "foundation-sites";
import "./css/index.scss";
import "css/app.css";

import { SecretDevtools } from "secret-devtools";
import React from "react";
import ReactDOM from "react-dom";

import ErrorBoundary from "components/errors/error-boundary-container";
import MainSpace from "components/main-space/main-space";
import Header from "components/header/header.tsx";
import ANewVersionIsAvailable from "components/header/a-new-version-is-available";
import WindowResize from "components/common/window-resize";

import { Store } from "reducers/real-estate-store";
import { Provider } from "react-redux";
import store from "reducers/store.ts";

import version from "version.ts";

import { NotificationContainer } from "react-notifications";
import { initTracker } from "./logging/tracker.ts";
import "./translations/translations";
import BackgroundLoadingInfoContainer from "./components/background-loading-info/background-loading-info-container";
import styled from "styled-components";
import Modal from "react-modal";

document.title = `Archifiltre v${version}`;

SecretDevtools.enable();
initTracker();

const App = styled.div`
  padding-top: 0.975em;
  padding-right: 0.975em;
  padding-bottom: 0.975em;
  padding-left: 0.975em;
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
        {props => {
          const api = props.api;
          return (
            <ErrorBoundary api={api}>
              <WindowResize />
              <App className="grid-y grid-frame">
                <div className="cell">
                  <ANewVersionIsAvailable />
                </div>
                <div className="cell">
                  <Header api={api} />
                </div>
                <div className="cell auto">
                  <MainSpace api={api} />
                </div>
                <BackgroundLoadingInfoContainer />
              </App>
              <NotificationContainer />
            </ErrorBoundary>
          );
        }}
      </Store>
    </Provider>,
    rootDiv
  );
};

window.addEventListener("load", app);

document.ondragover = document.ondrop = event => {
  event.preventDefault();
  return false;
};

window.ondragover = window.ondrop = event => {
  event.preventDefault();
  return false;
};
