import { loadCsvFileToArray } from "@common/utils/csv";
import path from "path";

import type { MetadataImportConfig } from "../../components/modals/MetadataModal/MetadataModalTypes";
import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { getOriginalPathFromStore } from "../workspace-metadata/workspace-metadata-selectors";
import { addBatchMetadataAction } from "./metadata-actions";
import { recordsToMetadata } from "./metadata-operations";

interface ImportMetadataThunkOptions extends MetadataImportConfig {
  delimiter: string;
}

const getIdFromRelativePath = (basePath: string) => {
  const rootDirectoryName = path.basename(basePath);
  return (elementPath: string) =>
    path.join(`/${rootDirectoryName}`, elementPath);
};

export const importMetadataThunk =
  (
    filePath: string,
    { entityIdKey, delimiter, fields }: ImportMetadataThunkOptions
  ): ArchifiltreDocsThunkAction<Promise<void>> =>
  async (dispatch, getState) => {
    const originalPath = getOriginalPathFromStore(getState());

    const csvData = await loadCsvFileToArray(filePath, { delimiter });

    const metadata = recordsToMetadata(csvData, {
      entityIdKey,
      entityIdTransformer: getIdFromRelativePath(originalPath),
    }).filter(
      ({ entity, name }) =>
        entity !== "" && name !== "" && fields.includes(name)
    );

    dispatch(addBatchMetadataAction(metadata));
  };
