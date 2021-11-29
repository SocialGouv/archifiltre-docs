import type { FileLastModifiedDateProps } from "components/main-space/workspace/general/session-info/file-last-modified-date";
import FileLastModifiedDate from "components/main-space/workspace/general/session-info/file-last-modified-date";
import type { FolderBoundaryDatesProps } from "components/main-space/workspace/general/session-info/folder-boundary-dates";
import FolderBoundaryDates from "components/main-space/workspace/general/session-info/folder-boundary-dates";
import { branch } from "hoc/branch";

type LastModifiedDateProps = FileLastModifiedDateProps &
    FolderBoundaryDatesProps & {
        isFile: boolean;
    };

const LastModifiedDate = branch<LastModifiedDateProps>(
    ({ isFile }) => isFile,
    FileLastModifiedDate,
    FolderBoundaryDates
);

export default LastModifiedDate;
