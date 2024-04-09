import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React, { type FC } from "react";

import { type Metadata } from "../../../reducers/metadata/metadata-types";

interface MetadataModalViewProps {
  metadataList: Metadata[];
}

export const MetadataModalView: FC<MetadataModalViewProps> = ({ metadataList }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Métadonnée</TableCell>
          <TableCell>{"Valeur d'exemple"}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {metadataList.map(metadata => (
          <TableRow key={metadata.id}>
            <TableCell>{metadata.name}</TableCell>
            <TableCell>{metadata.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
