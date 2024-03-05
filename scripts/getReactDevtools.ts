// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./unzip-crx-3.d.ts" />

import axios from "axios";
import { spawn } from "child_process";
import { createWriteStream } from "fs";
import path from "path";
import { sync as rimraf } from "rimraf";
import type { Stream } from "stream";
import unzipCrx from "unzip-crx-3";

const scriptsFolderPath = path.join(process.cwd(), "scripts");
const REACT_DEVTOOLS_EXTENSION_ID = "fmkadmapgofadopljbjfkapdkoienihi";
const TOKEN_START = ">>>>>";
const TOKEN_END = "<<<<<";
const getChromiumUserAgent = async () =>
  new Promise<string>((resolve) => {
    const electronChromiumVersionProcess = spawn(`yarn`, [
      "electron",
      path.join(scriptsFolderPath, "electron_chromiumVersion.js"),
    ]);

    electronChromiumVersionProcess.stdout.on("data", (buffer: Buffer) => {
      const data = buffer.toString();
      if (data.startsWith(TOKEN_START)) {
        electronChromiumVersionProcess.kill("SIGINT");
        resolve(data.replace(TOKEN_START, "").replace(TOKEN_END, ""));
      }
    });
  });

const getChromeVersion = (userAgent: string) => {
  const pieces = /Chrom(?:e|ium)\/(\d+)\.(\d+)\.(\d+)\.(\d+)/.exec(userAgent);
  if (!pieces || pieces.length != 5) {
    throw new Error(`Unparsable user agent: ${userAgent}`);
  }

  const ret = pieces.slice(1).map((piece) => parseInt(piece, 10));

  return {
    build: ret[2],
    major: ret[0],
    minor: ret[1],
    patch: ret[3],
  };
};

const downloadFile = async (url: string, outputLocationPath: string) => {
  const writer = createWriteStream(outputLocationPath);

  return axios
    .get<Stream>(url, {
      responseType: "stream",
    })
    .then(async (response) => {
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error: Error | null = null;
        writer.on("error", (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on("close", () => {
          if (!error) {
            resolve(true);
          }
        });
      });
    });
};

const getNaclArch = (userAgent: string) =>
  userAgent.includes("x86")
    ? "x86-32"
    : userAgent.includes("x64")
    ? "x86-64"
    : "arm";

(async () => {
  const userAgent = await getChromiumUserAgent();
  const { major, minor, build, patch } = getChromeVersion(userAgent);
  const version = `${major}.${minor}.${build}.${patch}`;
  const naclArch = getNaclArch(userAgent);
  const url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${version}&x=id%3D${REACT_DEVTOOLS_EXTENSION_ID}%26uc&nacl_arch=${naclArch}&acceptformat=crx2,crx3`;
  const zipPath = path.join(
    scriptsFolderPath,
    "out",
    "react-devtools-extension.crx"
  );
  const destFolder = zipPath.replace(".crx", "");
  rimraf(zipPath);
  rimraf(destFolder);

  console.info(`Download React Devtools to ${destFolder}`);
  await downloadFile(url, zipPath);

  console.info("Extracting...");
  await unzipCrx(zipPath, destFolder);
  rimraf(zipPath);

  console.info("Done.");
  process.exit(0);
})().catch(console.error);
