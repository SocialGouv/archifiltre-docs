import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import type {
  FieldsConfig,
  FieldsConfigChangeHandler,
} from "./ImportModalTypes";

interface ImportModalPreviewProps {
  fieldsConfig: FieldsConfig;
  onFieldsConfigChange: FieldsConfigChangeHandler;
  previewData?: Record<string, string>;
}

export const ImportModalFields: FC<ImportModalPreviewProps> = ({
  fieldsConfig,
  onFieldsConfigChange,
  previewData,
}) => {
  const { t } = useTranslation();

  const hasOption = (key: string) => fieldsConfig.some((name) => key === name);

  const addOption = (key: string) => {
    if (!hasOption(key)) {
      onFieldsConfigChange([...fieldsConfig, key]);
    }
  };

  const removeOption = (key: string) => {
    onFieldsConfigChange(fieldsConfig.filter((name) => name !== key));
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>{t("metadata.name")}</TableCell>
          <TableCell>{t("metadata.content")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(previewData ?? {}).map(([name, content]) => (
          <TableRow key={name}>
            <TableCell>
              <Checkbox
                checked={hasOption(name)}
                onChange={(event) => {
                  if (event.target.checked) {
                    addOption(name);
                  } else {
                    removeOption(name);
                  }
                }}
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
