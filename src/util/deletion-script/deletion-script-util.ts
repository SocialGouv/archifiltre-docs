import { compose, join, map } from "lodash/fp";
import path from "path";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";
import { isWindows } from "util/os/os-util";

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
) => `cd "${rootPath}"
$folders = @(${formatWindowsPaths(pathsToDelete)})
$folders | Remove-Item -Recurse -Force
`;

export const generateDeletionScript = isWindows()
    ? generateWindowDeletionScript
    : generateUnixDeletionScript;
