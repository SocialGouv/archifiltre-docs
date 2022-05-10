import type { ElectronApplication, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import path from "path";
import { sync as rimrafSync } from "rimraf";

import { createStructure } from "../utils/fs";
import { closeApp, startApp } from "./utils/test";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { describe, beforeEach, afterEach, beforeAll, afterAll } = test;
const it = test;

const TEST_TIMEOUT = 20000;

test.use({ navigationTimeout: TEST_TIMEOUT });
describe("App e2e", () => {
  let app: ElectronApplication, win: Page;
  beforeEach(async () => {
    [app, win] = await startApp();
  });

  afterEach(async () => {
    await closeApp(app);
  });

  it("should render the application", async () => {
    expect((await win.content()).includes(`<div id="app">`)).toBeTruthy();
  });
});

describe("App e2e with loaded folder", () => {
  const testFolderPath = path.resolve(
    __dirname,
    "../test-folder-render-icicles/"
  );

  beforeAll(async () => {
    await createStructure({
      [testFolderPath]: {
        "child/": {
          "index.txt": "test-folder-render-icicles",
        },
      },
    });
  });

  afterAll(() => {
    rimrafSync(testFolderPath);
  });

  let app: ElectronApplication, win: Page;
  beforeEach(async () => {
    [app, win] = await startApp(testFolderPath);
  });

  afterEach(async () => {
    await closeApp(app);
  });

  it("should render icicles", async () => {
    await win.waitForSelector(`[data-test-id="main-icicle"]`);
    await win.waitForSelector(
      `[data-test-id="main-icicle"] [data-test-id="/test-folder-render-icicles/child/index.txt"]`
    );
  });
});
