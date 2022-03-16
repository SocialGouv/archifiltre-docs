const path = require("path");
const webpack = require("webpack");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const packageJson = require("./package.json");
require("dotenv").config();

module.exports =
  /** @param {import("webpack").Configuration} config */ function (config) {
    const isProd = config.mode === "production";
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.alias["@common"] = config.resolve.alias["common"];
    config.resolve.alias["@event"] = path.resolve(
      config.resolve.alias["@common"],
      "event"
    );

    if (!config.plugins) {
      config.plugins = [];
    }
    const project = `${packageJson.name}${isProd ? "" : "-dev"}`;
    if (isProd) {
      config.plugins.push(
        new webpack.EnvironmentPlugin([
          "TRACKER_MATOMO_ID_SITE",
          "TRACKER_MATOMO_URL",
          // "TRACKER_PROVIDER",
          // "TRACKER_POSTHOG_API_KEY",
          // "TRACKER_POSTHOG_URL",
          "SENTRY_ORG",
          "SENTRY_DSN",
          "SENTRY_URL",
        ]),
        new webpack.DefinePlugin({
          ARCHIFILTRE_SITE_URL: JSON.stringify(
            process.env.ARCHIFILTRE_SITE_URL
          ),
          ARCHIFILTRE_VERSION: JSON.stringify(
            require("./package.json").version
          ),
          AUTOLOAD: process.env.AUTOLOAD
            ? JSON.stringify(process.env.AUTOLOAD)
            : JSON.stringify(""),
          AUTORELOAD: process.env.AUTORELOAD
            ? JSON.stringify(process.env.AUTORELOAD)
            : JSON.stringify(""),
          FORCE_TRACKING: JSON.stringify(process.env.FORCE_TRACKING === "true"),
          MATOMO_APPLICATION_ID: process.env.MATOMO_APPLICATION_ID,
          MATOMO_URL: JSON.stringify(process.env.MATOMO_URL),
          MODE: JSON.stringify(config.mode ?? "development"),
          SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
          WRITE_DEBUG: process.env.WRITE_DEBUG,
        })
        // ,new webpack.DefinePlugin({
        //   "process.env.TRACKER_FAKE_HREF": JSON.stringify(`https://${project}`),
        // })
      );
    } else {
      if (config.devServer) {
        config.devServer.writeToDisk = true;
      }
      config.plugins.push(
        new webpack.EnvironmentPlugin(["REACT_DEV_TOOLS_PATH"])
      );
    }

    const skipSentry =
      process.env.SKIP_SENTRY_UPLOAD === 1 ||
      process.env.SKIP_SENTRY_UPLOAD === "1";

    if (isProd && !skipSentry) {
      config.devtool = "source-map";
      // TODO: enable source association by adding (not legacy) github integration to Sentry
      config.plugins.push(
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          include: ["dist/"],
          project,
          release: `${packageJson.name}@${packageJson.version}`,
        })
      );
    }

    return config;
  };
