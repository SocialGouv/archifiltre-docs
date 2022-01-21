require("dotenv").config();
const { notarize } = require("electron-notarize");
const { appId: appBundleId } = require("../package.json").build;

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (
    electronPlatformName !== "darwin" ||
    !process.env.APPLE_ID ||
    !process.env.APPLE_ID_PASSWORD ||
    process.env.CSC_IDENTITY_AUTO_DISCOVERY === "false"
  ) {
    console.info("  • notarize skipped");
    return;
  }
  const appName = context.packager.appInfo.productFilename;

  console.info("  • notarize application");
  try {
    return await notarize({
      appBundleId,
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
    });
  } catch (error) {
    console.error("  • fail notarizing 🚨");
    console.error(error);
  }
};
