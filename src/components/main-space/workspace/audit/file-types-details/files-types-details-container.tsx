import React, { FC, useMemo } from "react";
import FileTypesDetails from "./file-types-details";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  countFileSizes,
  countFileTypes,
} from "exporters/audit/audit-report-values-computer";

const FileTypesDetailsContainer: FC = () => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const fileTypesCount = useMemo(() => countFileTypes(filesAndFolders), [
    filesAndFolders,
  ]);

  const fileSizesCount = useMemo(() => countFileSizes(filesAndFolders), [
    filesAndFolders,
  ]);

  return (
    <FileTypesDetails
      elementsCountsByType={fileTypesCount}
      elementsSizesByType={fileSizesCount}
    />
  );
};

export default FileTypesDetailsContainer;
