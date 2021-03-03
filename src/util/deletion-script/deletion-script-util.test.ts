import fs from "fs";
import path from "path";
import cp from "child_process";
import { isUnixLike, isWindows } from "util/os/os-util";
import {
  generateUnixDeletionScript,
  generateWindowDeletionScript,
} from "util/deletion-script/deletion-script-util";

const onWindows = isWindows() ? it : it.skip;
const onLinux = isUnixLike() ? it : it.skip;

const workingDir = path.join(__dirname, "test-folder");

const filesToDelete = ["/test-folder/child-element", "/test-folder/deleted"];

const unixScriptPath = path.join(__dirname, "script.sh");
const windowsScriptPath = path.join(__dirname, "script.ps1");

describe("deletion-script-util", () => {
  beforeEach(() => {
    fs.mkdirSync(workingDir);
    fs.mkdirSync(path.join(workingDir, "child-element"));
    fs.mkdirSync(path.join(workingDir, "non-deleted-element"));
    fs.writeFileSync(path.join(workingDir, "child-element/file"), "content");
    fs.writeFileSync(path.join(workingDir, "deleted"), "content");
  });

  afterEach(() => {
    fs.rmdirSync(workingDir, { recursive: true });

    isWindows()
      ? fs.unlinkSync(windowsScriptPath)
      : fs.unlinkSync(unixScriptPath);
  });
  describe("generate-deletion-script-for-windows", () => {
    onWindows("the script should delete the specified elements", () => {
      const script = generateWindowDeletionScript(__dirname, filesToDelete);
      fs.writeFileSync(windowsScriptPath, script);
      cp.spawnSync("powershell.exe", [windowsScriptPath]);
      const remainingElements = fs.readdirSync(workingDir);
      expect(remainingElements).toEqual(["non-deleted-element"]);
    });
  });

  describe("generate-deletion-script-for-linux", () => {
    onLinux("the script should delete the specified elements", () => {
      const script = generateUnixDeletionScript(__dirname, filesToDelete);
      fs.writeFileSync(unixScriptPath, script);
      fs.chmodSync(unixScriptPath, "755");
      cp.execFileSync(unixScriptPath);
      const remainingElements = fs.readdirSync(workingDir);
      expect(remainingElements).toEqual(["non-deleted-element"]);
    });
  });
});
