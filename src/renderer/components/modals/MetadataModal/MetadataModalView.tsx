import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import type { FC } from "react";
import React from "react";

import type { Metadata } from "../../../reducers/metadata/metadata-types";
import { useSedaMapping } from "../../../reducers/seda-configuration/seda-configuration-selector";
import type { SedaPropertySelectorProps } from "../../common/resip/seda-property-selector";
import { SedaPropertySelector } from "../../common/resip/seda-property-selector";

interface MetadataModalViewProps {
  metadataList: Metadata[];
}

export const MetadataModalView: FC<MetadataModalViewProps> = ({
  metadataList,
}) => {
  const [mapping, setMapping] = useSedaMapping();

  const onMappingChange =
    (metadataId: string): SedaPropertySelectorProps["onChange"] =>
    (field) => {
      setMapping({
        ...mapping,
        [metadataId]: field,
      });
    };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Métadonnée</TableCell>
          <TableCell>{"Valeur d'exemple"}</TableCell>
          <TableCell>Metadonnée Resip</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {metadataList.map((metadata) => (
          <TableRow key={metadata.id}>
            <TableCell>{metadata.name}</TableCell>
            <TableCell>{metadata.content}</TableCell>
            <TableCell>
              <SedaPropertySelector
                value={mapping[metadata.name]}
                onChange={onMappingChange(metadata.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
