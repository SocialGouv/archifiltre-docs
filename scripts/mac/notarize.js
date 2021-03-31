const { notarize } = require("electron-notarize");

module.exports = async function notarizing(context) {
  const { appOutDir } = context;

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "com.fabrique.archifiltre",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
