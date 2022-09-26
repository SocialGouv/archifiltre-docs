const path = require("path");
const replace = require("replace");
const packageJson = require("../package.json");

const packageJsonPath = path.resolve(__dirname, "../package.json");
const nsisInstaller = path.resolve(
  __dirname,
  "../electron/build/installer.nsh"
);
const productName = packageJson.productName;
const appName = packageJson.name;
const channel = packageJson.version.includes("beta")
  ? "beta"
  : packageJson.version.includes("next")
  ? "next"
  : "stable";

if (channel === "stable") {
  console.info("[ReplaceForChannel] Replace not needed in stable.");
  process.exit();
}
console.log("[ReplaceForChannel] Channel detected:", channel);
const productNameReplacement = `"productName": "${productName} (${channel})"`;
console.log(
  "[ReplaceForChannel] Replacing product name with",
  productNameReplacement
);
replace({
  paths: [packageJsonPath],
  recursive: false,
  regex: `"productName": "${productName}"`,
  replacement: productNameReplacement,
  silent: true,
});

const iconPngReplacement = `"icon": "./electron/build/icon_${channel}.png"`;
console.log("[ReplaceForChannel] Replacing PNG icon with", iconPngReplacement);
replace({
  paths: [packageJsonPath],
  recursive: false,
  regex: /"icon": "\.\/electron\/build\/icon\.png"/g,
  replacement: iconPngReplacement,
  silent: true,
});

const iconIcnsReplacement = `"icon": "./electron/build/icon_${channel}.icns"`;
console.log(
  "[ReplaceForChannel] Replacing ICNS icon with",
  iconIcnsReplacement
);
replace({
  paths: [packageJsonPath],
  recursive: false,
  regex: /"icon": "\.\/electron\/build\/icon\.icns"/g,
  replacement: iconIcnsReplacement,
  silent: true,
});

const installPathReplacement = `LOCALAPPDATA\\Programs\\${appName}-${channel}"`;
console.log(
  "[ReplaceForChannel] Replacing custom NSIS install path",
  installPathReplacement
);
replace({
  paths: [nsisInstaller],
  recursive: false,
  regex: `LOCALAPPDATA\\\\Programs\\\\${appName}"`,
  replacement: installPathReplacement,
  silent: false,
});
