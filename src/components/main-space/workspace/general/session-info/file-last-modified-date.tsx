import React from "react";

import { DateField } from "../../../../common/date-field";

export interface FileLastModifiedDateProps {
    lastModified: number;
    onDateChange: (date: number) => void;
}

export const FileLastModifiedDate: React.FC<FileLastModifiedDateProps> = ({
    lastModified,
    onDateChange,
}) => <DateField date={lastModified} onDateChange={onDateChange} />;
