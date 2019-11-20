// Enables reporter to hook into the environment so it captures uncaught errors
import "./logging/reporter";

import "foundation-sites";
import "./css/index.scss";
import "css/app.css";

import { SecretDevtools } from "secret-devtools";
import React from "react";
import ReactDOM from "react-dom";

import ErrorBoundary from "components/errors/error-boundary";
import MainSpace from "components/main-space/main-space";
import Header from "components/header/header";
import ANewVersionIsAvailable from "components/header/a-new-version-is-available";
import WindowResize from "components/common/window-resize";

import { Store } from "reducers/real-estate-store";
import { Provider } from "react-redux";
import store from "reducers/store.ts";

import version from "version";
import pick from "languages";

import { NotificationContainer } from "react-notifications";
import { initTracker } from "./logging/tracker.ts";

document.title = pick({
  en: "Archifiltre v" + version,
  fr: "Archifiltre v" + version
});

SecretDevtools.enable();
initTracker();

/**This is the entrypoint for the app. */
const app = () => {
  const rootDiv = document.createElement("div");
  rootDiv.setAttribute("id", "root");

  if (document.body !== null) {
    document.body.appendChild(rootDiv);
  }

  ReactDOM.render(
    <Provider store={store}>
      <Store>
        {props => {
          const api = props.api;
          return (
            <ErrorBoundary api={api}>
              <WindowResize />
              <div className="grid-y grid-frame">
                <div className="cell">
                  <ANewVersionIsAvailable />
                </div>
                <div className="cell">
                  <Header api={api} />
                </div>
                <div className="cell auto">
                  <MainSpace api={api} />
                </div>
              </div>
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

document.ondragover = document.ondrop = ev => {
  ev.preventDefault();
  return false;
};

window.ondragover = window.ondrop = ev => {
  ev.preventDefault();
  return false;
};
