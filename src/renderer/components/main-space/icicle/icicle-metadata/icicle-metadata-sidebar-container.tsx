import React from "react";

import { useMetadataByEntityId } from "../../../../reducers/metadata/metadata-selector";
import { useActiveElement } from "../../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { IcicleMetadataSidebar } from "./icicle-metadata-sidebar";

export const IcicleMetadataSidebarContainer = (): React.ReactNode => {
  const entityId = useActiveElement();
  const metadata = useMetadataByEntityId(entityId);

  return <IcicleMetadataSidebar metadata={metadata} />;
};
