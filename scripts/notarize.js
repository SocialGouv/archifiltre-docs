require("dotenv").config();
const { notarize } = require("@electron/notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== "darwin") {
    console.info("  • notarize skipped: not macOS platform", {
      electronPlatformName,
    });
    return;
  }

  const {
    APPLE_ID,
    APPLE_ID_PASSWORD,
    APPLE_ID_TEAM,
    CSC_IDENTITY_AUTO_DISCOVERY,
  } = process.env;

  if (
    !APPLE_ID ||
    !APPLE_ID_PASSWORD ||
    !APPLE_ID_TEAM ||
    CSC_IDENTITY_AUTO_DISCOVERY === "false"
  ) {
    console.info(
      "  • notarize skipped: missing required environment variables or identity discovery disabled",
      {
        APPLE_ID: !!APPLE_ID,
        APPLE_ID_PASSWORD: !!APPLE_ID_PASSWORD,
        APPLE_ID_TEAM: !!APPLE_ID_TEAM,
        CSC_IDENTITY_AUTO_DISCOVERY,
      }
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  console.info("  • notarize application");

  try {
    await notarize({
      // appBundleId,
      appPath: `${appOutDir}/${appName}.app`,
      appleId: APPLE_ID,
      appleIdPassword: APPLE_ID_PASSWORD,
      teamId: APPLE_ID_TEAM,
      tool: "notarytool",
    });
    console.info("  • notarizing succeeded ✅");
  } catch (error) {
    console.error("  • fail notarizing 🚨");
    console.error(error);
  } finally {
    console.info("  • notarizing process completed");
  }
};
