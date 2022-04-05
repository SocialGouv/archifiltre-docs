"use strict";

module.hot?.reject();

// bridge worker to call "real" workers in Typescript
const path = require("path");

require("ts-node").register({
  project: path.resolve(__dirname, "../../tsconfig.json"),
});

console.log("BRIDGE CALLED, REDIRECT =>", process.argv[2]);
require(process.argv[2]);
