const webpackCommonConfig = require("./webpack.common.config");
const path = require("path");
const glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");

require("dotenv").config();

module.exports =
  /** @param {import("webpack").Configuration} config */ function (config) {
    const isProd = config.mode === "production";

    const workers = glob
      .sync("./src/renderer/**/*.fork.ts")
      .map((filePath) => {
        const name = path.basename(filePath, path.extname(filePath));
        return [
          name,
          path.dirname(filePath).split("src/renderer/")[1],
          filePath,
        ];
      })
      .reduce((acc, [name, directoryPath, filePath]) => {
        acc[path.join(directoryPath, name)] = filePath;
        return acc;
      }, {});

    if (isProd) {
      if (!config.plugins?.length) {
        config.plugins = [];
      }

      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "node_modules/fswin/electron",
              to: "lib/fswin/electron",
            },
            {
              from: "node_modules/fswin/node",
              to: "lib/fswin/node",
            },
          ],
        })
      );
    }

    config.entry = {
      ...config.entry,
      ...workers,
    };

    const finalConfig = webpackCommonConfig(config);

    const findHtmlWebpackPlugin = (plugins) =>
      plugins.find((plugin) => plugin?.options?.excludeChunks);

    findHtmlWebpackPlugin(finalConfig.plugins)?.options?.excludeChunks?.push?.(
      ...Object.keys(workers)
    );

    return finalConfig;
  };
