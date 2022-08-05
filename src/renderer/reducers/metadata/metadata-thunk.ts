import { loadCsvFileToArray } from "@common/utils/csv";
import path from "path";

import type { MetadataImportConfig } from "../../components/modals/import-modal/ImportModalTypes";
import { getIdFromPath } from "../../utils/file-and-folders";
import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { getOriginalPathFromStore } from "../workspace-metadata/workspace-metadata-selectors";
import { addBatchMetadataAction } from "./metadata-actions";
import { recordsToMetadata } from "./metadata-operations";

interface ImportMetadataThunkOptions extends MetadataImportConfig {
  delimiter: string;
}

const getElementIdFromAbsolutePath = (basePath: string) => {
  const rootIdPath = path.join(basePath, "..");
  return (elementPath: string) => getIdFromPath(rootIdPath, elementPath);
};

export const importMetadataThunk =
  (
    filePath: string,
    { entityIdKey, delimiter, fields }: ImportMetadataThunkOptions
  ): ArchifiltreDocsThunkAction =>
  async (dispatch, getState) => {
    const originalPath = getOriginalPathFromStore(getState());

    const csvData = await loadCsvFileToArray(filePath, { delimiter });

    const metadata = recordsToMetadata(csvData, {
      entityIdKey,
      entityIdTransformer: getElementIdFromAbsolutePath(originalPath),
    }).filter(
      ({ entity, name }) =>
        entity !== "" && name !== "" && fields.includes(name)
    );

    dispatch(addBatchMetadataAction(metadata));
  };
