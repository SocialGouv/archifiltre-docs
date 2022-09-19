const path = require("path");
const replace = require("replace");
const packageJson = require("../package.json");

const packageJsonPath = path.resolve(__dirname, "../package.json");
const productName = packageJson.build.productName;
const channel = packageJson.version.includes("beta")
  ? "beta"
  : packageJson.version.includes("next")
  ? "next"
  : "stable";

if (channel === "stable") {
  console.log("[ReplaceForChannel] Replace not need in stable.");
  process.exit();
}
console.log("[ReplaceForChannel] Channel detected:", channel);
const productNameReplacement = `"productName": "${productName}${
  channel === "stable" ? "" : ` (${channel})`
}"`;
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

const iconPngReplacement = `"icon": "./electron/build/icon_${
  channel === "stable" ? "" : `${channel}`
}.png"`;
console.log("[ReplaceForChannel] Replacing PNG icon with", iconPngReplacement);
replace({
  paths: [packageJsonPath],
  recursive: false,
  regex: `"icon": "./electron/build/icon.png"`,
  replacement: iconPngReplacement,
  silent: true,
});

const iconIcnsReplacement = `"icon": "./electron/build/icon_${
  channel === "stable" ? "" : `${channel}`
}.icns"`;
console.log(
  "[ReplaceForChannel] Replacing ICNS icon with",
  iconIcnsReplacement
);
replace({
  paths: [packageJsonPath],
  recursive: false,
  regex: `"icon": "./electron/build/icon.icns"`,
  replacement: iconIcnsReplacement,
  silent: true,
});
