import type { HashesMap } from "@common/utils/hashes-types";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { MetadataByEntity } from "../../reducers/metadata/metadata-types";
import type { SedaMetadataMapping } from "../../reducers/seda-configuration/seda-configuration-type";
import type { TagMap } from "../../reducers/tags/tags-types";

export interface CsvExportData {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes?: HashesMap;
  metadata: MetadataByEntity;
  metadataKeys: string[];
  sedaMapping: SedaMetadataMapping;
  tags: TagMap;
}
