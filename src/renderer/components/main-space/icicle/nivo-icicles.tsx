import { ResponsiveIcicles } from "@nivo/icicles";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  getFilesAndFoldersFromStore,
  ROOT_FF_ID,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "../../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { useIcicleSortMethod } from "../../../reducers/icicle-sort-method/icicle-sort-method-selectors";
import { useFillColor } from "../../../utils/color";

interface PartialFilesAndFolders {
  children: (PartialFilesAndFolders | string)[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  file_last_modified: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  file_size: number;
  id: string;
  name: string;
  virtualPath: string;
}

interface CompletedFilesAndFolders {
  children: CompletedFilesAndFolders[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  file_last_modified: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  file_size: number;
  id: string;
  name: string;
  virtualPath: string;
}

const recFF = (
  ff: PartialFilesAndFolders,
  ffmap: FilesAndFoldersMap
): PartialFilesAndFolders => {
  for (let idxChild = 0; idxChild < ff.children.length; idxChild++) {
    const child = ff.children[idxChild];
    if (typeof child === "string") {
      ff.children[idxChild] = recFF(ffmap[child], ffmap);
    }
  }

  return ff;
};

export const IciclesContainer = () => {
  const filesAndFolderMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFolderMetadataMap = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const { icicleSortMethod, icicleColorMode, elementWeightMethod } =
    useIcicleSortMethod();

  const data = useMemo(
    () => recFF({ ...filesAndFolderMap[ROOT_FF_ID] }, filesAndFolderMap),
    [filesAndFolderMap]
  ) as CompletedFilesAndFolders;

  const fillColor = useFillColor(
    filesAndFolderMap,
    filesAndFolderMetadataMap,
    icicleColorMode
  );

  console.log("data", data);

  // const colorConfig = useCallback(
  //   (node: ComputedDatum<CompletedFilesAndFolders>) => fillColor(node.data.id),
  //   [fillColor]
  // );

  return (
    <ResponsiveIcicles
      data={data}
      value="file_size"
      childColor={(node) => fillColor(node.data.id)}
    />
  );
};
