import {
  Checkbox,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import type { ChangeEvent, FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import type { MetadataImportConfig } from "./ImportModalTypes";

interface ImportModalPreviewProps {
  formValues: MetadataImportConfig;
  onFormChange: (formValue: MetadataImportConfig) => void;
  previewData?: Record<string, string>;
}

export const ImportModalFields: FC<ImportModalPreviewProps> = ({
  previewData,
  formValues,
  onFormChange,
}) => {
  const { t } = useTranslation();

  const isRowSelected = (rowName: string) =>
    formValues.fields.includes(rowName);

  const onRowSelectionChange =
    (rowName: string) => (event: ChangeEvent<HTMLInputElement>) => {
      onFormChange({
        ...formValues,
        fields: event.target.checked
          ? [...formValues.fields, rowName]
          : formValues.fields.filter((name) => name !== rowName),
      });
    };

  const onPathSelectionChange = (entityIdKey: string) => () => {
    onFormChange({
      ...formValues,
      entityIdKey,
    });
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("importModal.pathField")}</TableCell>
          <TableCell>{t("importModal.import")}</TableCell>
          <TableCell>{t("metadata.name")}</TableCell>
          <TableCell>{t("metadata.content")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(previewData ?? {}).map(([name, content]) => (
          <TableRow key={name}>
            <TableCell>
              <Radio
                checked={formValues.entityIdKey === name}
                onChange={onPathSelectionChange(name)}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={isRowSelected(name)}
                onChange={onRowSelectionChange(name)}
              />
            </TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
