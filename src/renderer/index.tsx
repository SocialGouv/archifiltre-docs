// Enables reporter to hook into the environment so it captures uncaught errors
import "./css/index.scss";
import "./translations/translations";

import { setupSentry } from "@common/monitoring/sentry";
import Box from "@material-ui/core/Box";
import React from "react";
import { render } from "react-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import { BackgroundLoadingInfoContainer } from "./components/background-loading-info/background-loading-info-container";
import { Providers } from "./components/common/providers";
import { WindowResize } from "./components/common/window-resize";
import { NewVersionChecker } from "./components/header/new-version-checker";
import { MainSpace } from "./components/main-space/main-space";
import { Modals } from "./components/modals/modals";
import { initReporter, reportInfo } from "./logging/reporter";
import { initTracker } from "./logging/tracker";
import {
  getInitialUserSettings,
  initUserSettings,
} from "./persistence/persistent-settings";
import { initPreviousSessions } from "./persistence/previous-sessions";
import { SecretDevtools } from "./secret-devtools";
import { setupLanguage } from "./utils/language";
import { version } from "./version";

module.hot?.accept();

setupSentry();

reportInfo("Docs started");

document.title = `Docs v${version}`;

SecretDevtools.enable();
initUserSettings();
setupLanguage();
initPreviousSessions();
const { isTrackingEnabled, isMonitoringEnabled } = getInitialUserSettings();
initTracker(isTrackingEnabled);
initReporter(isMonitoringEnabled);

const App = styled.div`
  padding: 0.975em;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

/** This is the entrypoint for the app. */
render(
  <Providers>
    <WindowResize />
    <App>
      <Box display="flex" flexDirection="column" height="100%" width="100%">
        <Box height="100%">
          <MainSpace />
        </Box>
        <BackgroundLoadingInfoContainer />
      </Box>
      <NewVersionChecker />
    </App>
    <ToastContainer draggable={false} theme={"colored"} />
    <Modals />
  </Providers>,
  document.querySelector("#app")
);

document.ondragover = document.ondrop = (event) => {
  event.preventDefault();
  return false;
};

window.ondragover = window.ondrop = (event) => {
  event.preventDefault();
  return false;
};