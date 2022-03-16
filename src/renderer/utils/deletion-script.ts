import { isWindows } from "@common/utils/os";
import { compose, join, map } from "lodash/fp";
import path from "path";

import { formatPathForUserSystem } from "./file-system/file-sys-util";

const formatUnixPath = compose(
  join(" "),
  map((elementPath: string) => `"${path.join(".", elementPath)}"`)
);

export const generateUnixDeletionScript = (
  rootPath: string,
  pathsToDelete: string[]
): string => `#!/bin/bash
cd ${rootPath}
ELEMENTS_TO_DELETE=(${formatUnixPath(pathsToDelete)})
for file in "\${ELEMENTS_TO_DELETE[@]}"
do
  rm -rf $file
done`;

const formatWindowsPaths = compose(
  join(","),
  map((normalizedPath) => `"${normalizedPath}"`),
  map((pathToFormat: string) => formatPathForUserSystem(pathToFormat))
);

export const generateWindowDeletionScript = (
  rootPath: string,
  pathsToDelete: string[]
): string => `cd "${rootPath}"
$folders = @(${formatWindowsPaths(pathsToDelete)})
$folders | Remove-Item -Recurse -Force
`;

export const generateDeletionScript = isWindows()
  ? generateWindowDeletionScript
  : generateUnixDeletionScript;
