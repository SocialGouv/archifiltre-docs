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

interface ImportModalPreviewProps {
  previewData?: Record<string, string>;
}

export const ImportModalFields: FC<ImportModalPreviewProps> = ({
  previewData,
}) => {
  const { t } = useTranslation();
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
              <Checkbox />
            </TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
