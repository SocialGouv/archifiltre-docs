import { branch } from "../../../../../hoc/branch";
import type { FileLastModifiedDateProps } from "./file-last-modified-date";
import { FileLastModifiedDate } from "./file-last-modified-date";
import type { FolderBoundaryDatesProps } from "./folder-boundary-dates";
import { FolderBoundaryDates } from "./folder-boundary-dates";

export type LastModifiedDateProps = FileLastModifiedDateProps &
    FolderBoundaryDatesProps & {
        isFile: boolean;
    };

export const LastModifiedDate = branch<LastModifiedDateProps>(
    ({ isFile }) => isFile,
    FileLastModifiedDate,
    FolderBoundaryDates
);
