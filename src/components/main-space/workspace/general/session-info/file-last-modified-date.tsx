import React, { FC } from "react";
import DateField from "components/common/date-field";

export type FileLastModifiedDateProps = {
  lastModified: number;
  onDateChange: (date: number) => void;
};

const FileLastModifiedDate: FC<FileLastModifiedDateProps> = ({
  lastModified,
  onDateChange,
}) => <DateField date={lastModified} onDateChange={onDateChange} />;

export default FileLastModifiedDate;
