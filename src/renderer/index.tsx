// Enables reporter to hook into the environment so it captures uncaught errors
import "./css/index.scss";
import "./translations/translations";

import { PRODUCT_CHANNEL } from "@common/config";
import { get as getConfig } from "@common/modules/new-user-config";
import { getTrackerProvider, initTracking, toggleTracking } from "@common/modules/tracker";
import { setupSentry } from "@common/monitoring/sentry";
import Box from "@mui/material/Box";
import React from "react";
import { render } from "react-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import { BackgroundLoadingInfoContainer } from "./components/background-loading-info/background-loading-info-container";
import { Providers } from "./components/common/providers";
import { MainSpace } from "./components/main-space/main-space";
import { Modals } from "./components/modals/modals";
import { initReporter, reportInfo } from "./logging/reporter";
import { getInitialUserLocalSettings, initUserLocalSettings } from "./persistence/persistent-settings";
import { initPreviousSessions } from "./persistence/previous-sessions";
import { SecretDevtools } from "./secret-devtools";
import { setupLanguage } from "./utils/language";
import { version } from "./version";

module.hot?.decline();

const setupSentryIntegrations = setupSentry();

reportInfo("Docs started");

document.title = `Docs v${version} (${PRODUCT_CHANNEL})`;

SecretDevtools.enable();

void (async () => {
  initUserLocalSettings();
  const { isTrackingEnabled, isMonitoringEnabled, language } = getInitialUserLocalSettings();

  await setupLanguage(language);

  initPreviousSessions();

  initReporter(isMonitoringEnabled);

  await initTracking();

  toggleTracking(isTrackingEnabled);
  setupSentryIntegrations(getConfig("appId"), ...getTrackerProvider().getSentryIntegations());

  const App = styled.div`
    padding: 0.975em;
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
  `;

  /** This is the entrypoint for the app. */
  render(
    <Providers>
      <App>
        <Box display="flex" flexDirection="column" height="100%" width="100%">
          <Box height="100%">
            <MainSpace />
          </Box>
          <BackgroundLoadingInfoContainer />
        </Box>
      </App>
      <ToastContainer draggable={false} theme={"colored"} position="bottom-right" />
      <Modals />
    </Providers>,
    document.querySelector("#app"),
  );

  document.ondragover = document.ondrop = event => {
    event.preventDefault();
    return false;
  };

  window.ondragover = window.ondrop = event => {
    event.preventDefault();
    return false;
  };
})();
