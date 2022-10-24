import { loadCsvFileToArray } from "@common/utils/csv";
import { loadXlsx } from "@common/utils/xlsx";
import path from "path";

import { isCsvMetadataFileConfig } from "../../components/modals/MetadataModal/MetadataModalCommon";
import type {
  MetadataFileConfig,
  MetadataImportConfig,
} from "../../components/modals/MetadataModal/MetadataModalTypes";
import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { getOriginalPathFromStore } from "../workspace-metadata/workspace-metadata-selectors";
import { addBatchMetadataAction } from "./metadata-actions";
import { recordsToMetadata } from "./metadata-operations";

interface ImportMetadataThunkOptions {
  fieldsConfig: MetadataImportConfig;
  fileConfig: MetadataFileConfig;
}

const ARCHIFILTRE_PATH_SEPARATOR = "/";

const getIdFromRelativePath = (basePath: string) => {
  const rootDirectoryName = path.basename(basePath);
  return (elementPath: string) =>
    path.posix.join(
      `/${rootDirectoryName}`,
      elementPath.split(path.sep).join(ARCHIFILTRE_PATH_SEPARATOR)
    );
};

export const importMetadataThunk =
  (
    filePath: string,
    { fileConfig, fieldsConfig }: ImportMetadataThunkOptions
  ): ArchifiltreDocsThunkAction<Promise<void>> =>
  async (dispatch, getState) => {
    const originalPath = getOriginalPathFromStore(getState());

    const csvData = isCsvMetadataFileConfig(fileConfig)
      ? await loadCsvFileToArray(filePath, { delimiter: fileConfig.delimiter })
      : loadXlsx(filePath, fileConfig.selectedSheet);

    const metadata = recordsToMetadata(csvData, {
      entityIdKey: fieldsConfig.entityIdKey,
      entityIdTransformer: getIdFromRelativePath(originalPath),
    }).filter(
      ({ entity, name }) =>
        entity !== "" && name !== "" && fieldsConfig.fields.includes(name)
    );

    dispatch(addBatchMetadataAction(metadata));
  };
