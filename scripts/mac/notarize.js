require("dotenv").config();
const { notarize } = require("electron-notarize");

const isMacOs = (context) => context.electronPlatformName !== "darwin";
const isSigned = (env) =>
  env.CSC_IDENTITY_AUTO_DISCOVERY !== "false" || !!env.CSC_LINK;
const shouldNotarize = (context, env) => isMacOs(context) && isSigned(env);

exports.default = async function notarizing(context) {
  const { appOutDir } = context;
  if (!shouldNotarize(context, process.env)) {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "com.fabrique.archifiltre",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
