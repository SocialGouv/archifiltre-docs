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

console.log("Channel detected:", channel);
const productNameReplacement = `"productName": "${productName}${
  channel === "stable" ? "" : ` (${channel})`
}"`;
console.log("Replacing product name with", productNameReplacement);
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
console.log("Replacing PNG icon with", iconPngReplacement);
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
console.log("Replacing ICNS icon with", iconIcnsReplacement);
replace({
  paths: [packageJsonPath],
  recursive: false,
  regex: `"icon": "./electron/build/icon.icns"`,
  replacement: iconIcnsReplacement,
  silent: true,
});
