import FileLastModifiedDate, {
  FileLastModifiedDateProps,
} from "components/main-space/workspace/general/session-info/file-last-modified-date";
import FolderBoundaryDates, {
  FolderBoundaryDatesProps,
} from "components/main-space/workspace/general/session-info/folder-boundary-dates";
import { branch } from "hoc/branch";

type LastModifiedDateProps = {
  isFile: boolean;
} & FileLastModifiedDateProps &
  FolderBoundaryDatesProps;

const LastModifiedDate = branch<LastModifiedDateProps>(
  ({ isFile }) => isFile,
  FileLastModifiedDate,
  FolderBoundaryDates
);

export default LastModifiedDate;
