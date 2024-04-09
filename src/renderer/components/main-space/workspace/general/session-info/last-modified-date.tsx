import { branch } from "../../../../../hoc/branch";
import { FileLastModifiedDate, type FileLastModifiedDateProps } from "./file-last-modified-date";
import { FolderBoundaryDates, type FolderBoundaryDatesProps } from "./folder-boundary-dates";

export type LastModifiedDateProps = FileLastModifiedDateProps &
  FolderBoundaryDatesProps & {
    isFile: boolean;
  };

export const LastModifiedDate = branch<LastModifiedDateProps>(
  ({ isFile }) => isFile,
  FileLastModifiedDate,
  FolderBoundaryDates,
);
