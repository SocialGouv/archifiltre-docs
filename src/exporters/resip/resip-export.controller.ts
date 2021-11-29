import type {
    AliasMap,
    CommentsMap,
    FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { TagMap } from "reducers/tags/tags-types";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";
import translations from "translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "util/async-worker/child-process";
import {
    backgroundWorkerProcess$,
    filterResults,
} from "util/batch-process/batch-process-util";

interface ResipExportProgress {
    count: number;
    resipCsv: string[][];
}

interface GenerateResipExportOptions {
    aliases: AliasMap;
    comments: CommentsMap;
    elementsToDelete: string[];
    filesAndFolders: FilesAndFoldersMap;
    filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
    tags: TagMap;
}

/**
 * Returns an observable that emits the final result and the progress state of the export
 * @param aliases
 * @param comments
 * @param filesAndFolders
 * @param filesAndFoldersMetadata
 * @param tags
 * @param elementsToDelete
 * @returns {Observable<ResipExportProgress>} An observable to follow the export progress
 */
export const generateResipExport$ = ({
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    tags,
}: GenerateResipExportOptions): Observable<ResipExportProgress> => {
    const { language } = translations;

    return backgroundWorkerProcess$(
        {
            aliases,
            comments,
            elementsToDelete,
            filesAndFolders,
            filesAndFoldersMetadata,
            language,
            tags,
        },
        createAsyncWorkerForChildProcessControllerFactory("resip-export.fork")
    )
        .pipe(filterResults())
        .pipe(map(({ result }) => result));
};
