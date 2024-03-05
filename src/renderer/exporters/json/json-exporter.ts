import { getTrackerProvider } from "@common/modules/tracker";
import { createHash } from "crypto";

import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
  getLastModifiedDateOverrides,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getHashesFromStore } from "../../reducers/hashes/hashes-selectors";
import { serializeMetadataContext } from "../../reducers/metadata/metadata-operations";
import { getMetadataContextFromState } from "../../reducers/metadata/metadata-selector";
import { getSedaState } from "../../reducers/seda-configuration/seda-configuration-selector";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import {
  getNameWithExtension,
  save,
} from "../../utils/file-system/file-sys-util";

export type ExportToJson = typeof jsonExporterThunk;

export interface JsonExporterThunkArgs {
  originalPath: string;
  sessionName: string;
  version: string;
}

/**
 * Exports the store data to a json file, and prompts the user to save it.
 * @param sessionName - The sessionName from real estate
 * @param originalPath - The originalPath from real estate
 * @param version - The version from real estate
 */
export const jsonExporterThunk =
  ({
    sessionName,
    originalPath,
    version,
  }: JsonExporterThunkArgs): ArchifiltreDocsThunkAction =>
  (_, getState) => {
    const state = getState();
    const fileName = getNameWithExtension(sessionName, "json");

    const exportedData = {
      aliases: getAliasesFromStore(state),
      comments: getCommentsFromStore(state),
      elementsToDelete: getElementsToDeleteFromStore(state),
      filesAndFolders: getFilesAndFoldersFromStore(state),
      hashes: getHashesFromStore(state),
      metadata: serializeMetadataContext(getMetadataContextFromState(state)),
      originalPath,
      overrideLastModified: getLastModifiedDateOverrides(state),
      sedaConfiguration: getSedaState(state),
      sessionName,
      tags: getTagsFromStore(state),
      version,
    };

    const content = JSON.stringify(exportedData);
    const hasher = createHash("sha256");
    hasher.update(content);

    getTrackerProvider().track("Work Saved", {
      workHash: hasher.digest("hex"),
    });

    save(fileName, content);
  };
