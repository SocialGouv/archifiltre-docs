const webpackCommonConfig = require("./webpack.common.config");
const path = require("path");
const glob = require("glob");

require("dotenv").config();

module.exports =
  /** @param {import("webpack").Configuration} config */ function (config) {
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
    const styleRules = config.module.rules.filter((rule) =>
      rule.test.toString().match(/css|less|s\(\[ac\]\)ss/)
    );

    styleRules.forEach((rule) => {
      const uses = rule.use;
      if (!Array.isArray(uses)) {
        return;
      }

      const cssLoader = uses.find((use) => use.loader === "css-loader");
      if (typeof cssLoader === "object") {
        cssLoader.options = {
          ...cssLoader.options,
          esModule: true,
          localsConvention: "camelCase",
          modules: {
            localIdentName: "[local]___[hash:base64:5]",
            mode: "local",
          },
          sourceMap: true,
        };
      }
    });

    config.entry = {
      ...config.entry,
      ...workers,
    };

    return webpackCommonConfig(config);
  };
