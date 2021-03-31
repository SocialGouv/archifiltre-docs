import { map, compose, join } from "lodash/fp";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";
import { isWindows } from "util/os/os-util";
import path from "path";

const formatUnixPath = compose(
  join(" "),
  map((elementPath: string) => `"${path.join(".", elementPath)}"`)
);

export const generateUnixDeletionScript = (
  rootPath: string,
  pathsToDelete: string[]
) => `#!/bin/bash
cd ${rootPath}
ELEMENTS_TO_DELETE=(${formatUnixPath(pathsToDelete)})
for file in "\${ELEMENTS_TO_DELETE[@]}"
do
  rm -rf $file
done`;

const formatWindowsPaths = compose(
  join(","),
  map((normalizedPath) => `"${normalizedPath}"`),
  map((path) => formatPathForUserSystem(path))
);

export const generateWindowDeletionScript = (
  rootPath: string,
  pathsToDelete: string[]
) => `@echo off
cd ${rootPath}
$folders = @(${formatWindowsPaths(pathsToDelete)})
$folders | Remove-Item -Recurse -Force
`;

export const generateDeletionScript = isWindows()
  ? generateWindowDeletionScript
  : generateUnixDeletionScript;
