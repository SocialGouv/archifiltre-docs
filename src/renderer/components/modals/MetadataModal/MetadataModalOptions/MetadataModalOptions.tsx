import { noop } from "lodash";
import type { FC } from "react";
import React from "react";

import type {
  FileConfigChangeHandler,
  MetadataFileConfig,
} from "../MetadataModalTypes";
import { CsvMetadataModalOptions } from "./CsvMetadataModalOptions";
import { XlsxMetadataModalOptions } from "./XlsxMetadataModalOptions";

export interface ImportModalOptionsProps {
  onChange?: FileConfigChangeHandler;
  options?: MetadataFileConfig;
}

export const MetadataModalOptions: FC<ImportModalOptionsProps> = ({
  options,
  onChange = noop,
}) => {
  if (options?.type === "CSV") {
    return <CsvMetadataModalOptions options={options} onChange={onChange} />;
  }

  return <XlsxMetadataModalOptions options={options} onChange={onChange} />;
};
