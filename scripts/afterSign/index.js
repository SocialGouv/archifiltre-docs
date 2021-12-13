const isMacOs = (context) => context.electronPlatformName === "darwin";

exports.default = (context) =>
  isMacOs(context) ? require("./mac")(context) : Promise.resolve();
