import { ratio } from "@common/utils/numbers";
import { useCallback, useMemo } from "react";

import { ROOT_FF_ID } from "../reducers/files-and-folders/files-and-folders-selectors";
import type {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { IcicleColorMode } from "../reducers/icicle-sort-method/icicle-sort-method-types";
import { FileType, FolderType, getFileTypeFromFileName } from "./file-types";
import { isCompressedFolder, isFile } from "./fileAndFolder";

type RgbaTuple = [
  red: number,
  green: number,
  blue: number,
  transparent: number
];

export type RgbaHex = `#${string}`;
export type RgbaFunc =
  | `rgba(${number}, ${number}, ${number}, ${number})`
  | `rgba(${number},${number},${number},${number})`;
export type RgbFunc =
  | `rgb(${number}, ${number}, ${number})`
  | `rgb(${number},${number},${number})`;

export const gradient =
  (firstColor: RgbaTuple, secondColor: RgbaTuple) =>
  (zeroToOne: number): RgbaTuple =>
    firstColor
      .map((color, index) => color + (secondColor[index] - color) * zeroToOne)
      .map((color, index) => {
        if (index !== 3) {
          return Math.round(color);
        } else {
          return color;
        }
      }) as RgbaTuple;

export const toRgba = (color: RgbaTuple): RgbaFunc =>
  `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;

export const fromRgba = (color: RgbaFunc): RgbaTuple =>
  color
    .split(/rgba\(|, |\)/)
    .filter((a) => a !== "")
    .map(Number) as RgbaTuple;

export const mostRecentDate = (): RgbaTuple => [255, 216, 155, 1];
export const leastRecentDate = (): RgbaTuple => [20, 86, 130, 1];

export const PLACEHOLDER_COLOR: RgbaHex = "#8a8c93";

export const colors: Record<FileType | FolderType, RgbaHex> = {
  [FileType.PUBLICATION]: "#b4250c",
  [FileType.PRESENTATION]: "#f75b40",
  [FileType.SPREADSHEET]: "#52d11a",
  [FileType.EMAIL]: "#13d6f3",
  [FileType.DOCUMENT]: "#4c78e8",
  [FileType.IMAGE]: "#b574f2",
  [FileType.VIDEO]: "#6700c7",
  [FileType.AUDIO]: "#ff35dd",
  [FileType.OTHER]: "#8a8c93",
  [FileType.COMPRESSED]: "#545454",
  [FolderType.FOLDER]: "#fabf0b",
};

export const getFileOrFolderColor = (file: FilesAndFolders): RgbaHex =>
  colors[
    isFile(file)
      ? getFileTypeFromFileName(file.name)
      : isCompressedFolder(file)
      ? FileType.COMPRESSED
      : FolderType.FOLDER
  ];
/**
 * Hook that returns the fillColorByType method. It allows to get the color of a node using its id.
 */
const useFillColorByType = (filesAndFolders: FilesAndFoldersMap) =>
  useCallback(
    (id: string) => getFileOrFolderColor(filesAndFolders[id]),

    [filesAndFolders]
  );

const dateGradient = gradient(leastRecentDate(), mostRecentDate());

/**
 * Hook that returns the fillColorByDate method. It allows to get the color of a node using its id.
 */
const useFillColorByDate = (
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
): ((id: string) => RgbaFunc) =>
  useCallback(
    (id) => {
      const { minLastModified, maxLastModified } =
        filesAndFoldersMetadata[ROOT_FF_ID];
      const { averageLastModified } = filesAndFoldersMetadata[id];
      return toRgba(
        dateGradient(
          ratio(averageLastModified, {
            max: maxLastModified,
            min: minLastModified,
          })
        )
      );
    },
    [filesAndFoldersMetadata]
  );

/**
 * Hook that returns the fillColor method. It returns the color of a node based on its id and the selected
 * sorting method.
 */
export const useFillColor = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  iciclesSortMethod: IcicleColorMode
): ((id: string) => RgbaFunc | RgbaHex) => {
  const fillColorByType = useFillColorByType(filesAndFolders);

  const fillColorByDate = useFillColorByDate(filesAndFoldersMetadata);

  return useMemo(
    () =>
      iciclesSortMethod === IcicleColorMode.BY_DATE
        ? fillColorByDate
        : fillColorByType,
    [iciclesSortMethod, fillColorByDate, fillColorByType]
  );
};
