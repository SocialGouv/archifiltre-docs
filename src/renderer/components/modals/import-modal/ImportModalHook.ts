import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import { detectConfig, loadCsvFirstRowToArray } from "@common/utils/csv";
import { defaults } from "lodash";
import { useState } from "react";

import type {
  ImportModalState,
  OptionChangeHandler,
  PathChangeHandler,
} from "./ImportModalTypes";

const defaultConfig = {
  delimiter: ",",
};

interface UseMetadataImportReturn {
  metadataConfig: LoadCsvFileToArrayOptions;
  metadataRow?: Record<string, string>;
  onOptionChange: OptionChangeHandler;
  onPathChange: PathChangeHandler;
  path: string;
  state: ImportModalState;
}

export const useMetadataImport = (): UseMetadataImportReturn => {
  const [path, setPath] = useState("");
  const [state, setState] = useState<ImportModalState>("initial");

  const [metadataRow, setMetadataRow] = useState<
    Record<string, string> | undefined
  >();
  const [metadataConfig, setMetadataConfig] =
    useState<LoadCsvFileToArrayOptions>(defaultConfig);

  const loadPreview = async (
    loadedPath?: string,
    config?: LoadCsvFileToArrayOptions
  ) => {
    const completeConfig = defaults(config, defaultConfig);

    if (completeConfig.delimiter === "") {
      return;
    }

    const row = await loadCsvFirstRowToArray(
      loadedPath ?? path,
      completeConfig
    );

    setMetadataRow(row);
    setState("preview");
  };

  const onPathChange = async (pickedFilePath: string) => {
    setPath(pickedFilePath);
    const config = await detectConfig(pickedFilePath);
    setMetadataConfig(config);

    await loadPreview(pickedFilePath, config);
  };

  const onOptionChange: OptionChangeHandler = async (label, value) => {
    const newConfig = {
      ...metadataConfig,
      [label]: value,
    };
    setMetadataConfig(newConfig);

    await loadPreview(void 0, newConfig);
  };

  return {
    metadataConfig,
    metadataRow,
    onOptionChange,
    onPathChange,
    path,
    state,
  };
};
