import DateField from "components/common/date-field";
import React from "react";

export interface FileLastModifiedDateProps {
    lastModified: number;
    onDateChange: (date: number) => void;
}

const FileLastModifiedDate: React.FC<FileLastModifiedDateProps> = ({
    lastModified,
    onDateChange,
}) => <DateField date={lastModified} onDateChange={onDateChange} />;

export default FileLastModifiedDate;
