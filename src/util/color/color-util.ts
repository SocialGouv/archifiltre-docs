import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import {
  FileType,
  getFileTypeFromFileName,
} from "util/file-types/file-types-util";
import {
  isFile,
  ROOT_FF_ID,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { ratio } from "util/numbers/numbers-util";
import { useCallback, useMemo } from "react";
import { IcicleColorMode } from "reducers/icicle-sort-method/icicle-sort-method-types";

export const gradient = (firstColor: number[], secondColor: number[]) => (
  zeroToOne: number
): number[] =>
  firstColor
    .map((color, index) => color + (secondColor[index] - color) * zeroToOne)
    .map((color, index) => {
      if (index !== 3) {
        return Math.round(color);
      } else {
        return color;
      }
    });

export const setAlpha = (alpha: number, color: number[]): number[] => {
  return color.slice(0, -1).concat([alpha]);
};

export const toRgba = (color: number[]): string =>
  `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;

export const fromRgba = (color: string): number[] =>
  color
    .split(/rgba\(|, |\)/)
    .filter((a) => a !== "")
    .map(Number);

export const mostRecentDate = () => [255, 216, 155, 1];
export const leastRecentDate = () => [20, 86, 130, 1];

const PLACEHOLDER_COLOR = "#8a8c93";
export const FOLDER_COLOR = "#fabf0b";

export const colors = {
  [FileType.PUBLICATION]: "#b4250c",
  [FileType.PRESENTATION]: "#f75b40",
  [FileType.SPREADSHEET]: "#52d11a",
  [FileType.EMAIL]: "#13d6f3",
  [FileType.DOCUMENT]: "#4c78e8",
  [FileType.IMAGE]: "#b574f2",
  [FileType.VIDEO]: "#6700c7",
  [FileType.AUDIO]: "#ff35dd",
  [FileType.OTHER]: "#8a8c93",
};

export const folder = () => FOLDER_COLOR;

export const placeholder = () => PLACEHOLDER_COLOR;

export const fromFileName = (name: string): string => {
  const fileType = getFileTypeFromFileName(name);
  return colors[fileType];
};

/**
 * Hook that returns the fillColorByType method. It allows to get the color of a node using its id.
 * @param filesAndFolders
 * @returns {*}
 */
const useFillColorByType = (filesAndFolders: FilesAndFoldersMap) =>
  useCallback(
    (id) => {
      const element = filesAndFolders[id];

      return isFile(element) ? fromFileName(element.name) : folder();
    },
    [filesAndFolders]
  );

const dateGradient = gradient(leastRecentDate(), mostRecentDate());

/**
 * Hook that returns the fillColorByDate method. It allows to get the color of a node using its id.
 * @param filesAndFoldersMetadata
 * @returns {*}
 */
const useFillColorByDate = (
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
) =>
  useCallback(
    (id) => {
      const { minLastModified, maxLastModified } = filesAndFoldersMetadata[
        ROOT_FF_ID
      ];
      const { averageLastModified } = filesAndFoldersMetadata[id];
      return toRgba(
        dateGradient(
          ratio(averageLastModified, {
            min: minLastModified,
            max: maxLastModified,
          })
        )
      );
    },
    [filesAndFoldersMetadata]
  );

/**
 * Hook that returns the fillColor method. It returns the color of a node based on its id and the selected
 * sorting method.
 * @param filesAndFolders
 * @param filesAndFoldersMetadata
 * @param iciclesSortMethod
 * @returns {*}
 */
export const useFillColor = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  iciclesSortMethod: IcicleColorMode
) => {
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
