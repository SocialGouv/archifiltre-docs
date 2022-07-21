import type { FC } from "react";
import React from "react";
import type { Metadata } from "src/renderer/reducers/metadata/metadata-types";

import { ColumnBlock } from "../icicle-layout";

interface IcicleMetadataSidebarProps {
  metadata: Metadata[];
}

export const IcicleMetadataSidebar: FC<IcicleMetadataSidebarProps> = ({
  metadata,
}) => {
  return (
    <ColumnBlock>
      {metadata.map((data) => (
        <p key={data.id}>
          {data.name} : {data.content}
        </p>
      ))}
    </ColumnBlock>
  );
};
