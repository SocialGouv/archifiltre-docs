// Enables reporter to hook into the environment so it captures uncaught errors
import { initReporter, reportInfo } from "logging/reporter";

import "./css/index.scss";
import Providers from "components/common/providers";
import { getInitialUserSettings, initUserSettings } from "persistent-settings";

import { SecretDevtools } from "secret-devtools";
import React from "react";
import ReactDOM from "react-dom";

import MainSpace from "components/main-space/main-space";
import Header from "components/header/header-container";
import { NewVersionChecker } from "components/header/new-version-checker";
import WindowResize from "components/common/window-resize-handler";

import version from "version";

import { NotificationContainer } from "react-notifications";
import { initTracker } from "logging/tracker";
import "translations/translations";
import BackgroundLoadingInfoContainer from "components/background-loading-info/background-loading-info-container";
import Box from "@material-ui/core/Box";
import styled from "styled-components";
import Modals from "components/modals/modals";

reportInfo("Archifiltre started");

document.title = `Archifiltre v${version}`;

SecretDevtools.enable();
initUserSettings();
const { isTrackingEnabled, isMonitoringEnabled } = getInitialUserSettings();
initTracker(isTrackingEnabled);
initReporter(isMonitoringEnabled);

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
    <Providers>
      <WindowResize />
      <App>
        <Box display="flex" flexDirection="column" height="100%" width="100%">
          <Box>
            <Header />
          </Box>
          <Box flexGrow={1} flexShrink={1} overflow="hidden">
            <MainSpace />
          </Box>
          <BackgroundLoadingInfoContainer />
        </Box>
        <NewVersionChecker />
      </App>
      <NotificationContainer />
      <Modals />
    </Providers>,
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
