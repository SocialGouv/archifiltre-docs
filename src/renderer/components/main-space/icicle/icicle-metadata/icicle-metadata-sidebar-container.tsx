import React from "react";

import { useMetadataByEntityId } from "../../../../reducers/metadata/metadata-selector";
import { useActiveElement } from "../../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { IcicleMetadataSidebar } from "./icicle-metadata-sidebar";

export const IcicleMetadataSidebarContainer = () => {
  const entityId = useActiveElement();
  const metadata = useMetadataByEntityId(entityId);

  console.log(metadata);

  return <IcicleMetadataSidebar metadata={metadata} />;
};
