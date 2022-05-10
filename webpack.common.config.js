const path = require("path");
const webpack = require("webpack");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const packageJson = require("./package.json");
require("dotenv").config();

module.exports =
  /** @param {import("webpack").Configuration} config */ function (config) {
    const isProd = config.mode === "production";
    const isTest = process.env.NODE_ENV?.startsWith("test");
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

    config.plugins.push(
      new webpack.EnvironmentPlugin(["ARCHIFILTRE_SITE_URL", "FORCE_TRACKING"]),
      new webpack.EnvironmentPlugin({
        SENTRY_DSN: "",
        SENTRY_ORG: "",
        SENTRY_URL: "",
        TRACKER_FAKE_HREF: JSON.stringify(`https://${project}`),
        TRACKER_MATOMO_ID_SITE: "",
        TRACKER_MATOMO_URL: "",
        TRACKER_POSTHOG_API_KEY: "",
        TRACKER_POSTHOG_URL: "",
        /** @type {import("./src/common/tracker/provider/utils").ProviderType} */
        TRACKER_PROVIDER: "debug",
      })
    );
    if (!isProd) {
      if (config.devServer) {
        config.devServer.writeToDisk = true;
      }
      config.plugins.push(
        new webpack.EnvironmentPlugin({ AUTOLOAD: false, AUTORELOAD: false })
      );
    }

    const skipSentry =
      process.env.SKIP_SENTRY_UPLOAD === 1 ||
      process.env.SKIP_SENTRY_UPLOAD === "1";

    if (!isTest && isProd && !skipSentry) {
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
