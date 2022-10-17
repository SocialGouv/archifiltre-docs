import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Metadata } from "src/renderer/reducers/metadata/metadata-types";

import { ColumnBlock } from "../icicle-layout";

interface IcicleMetadataSidebarProps {
  metadata: Metadata[];
}

export const IcicleMetadataSidebar: FC<IcicleMetadataSidebarProps> = ({
  metadata,
}) => {
  const { t } = useTranslation();
  return (
    <ColumnBlock>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("metadata.name")}</TableCell>
            <TableCell>{t("metadata.content")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metadata.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ColumnBlock>
  );
};
