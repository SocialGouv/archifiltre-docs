import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import { detectConfig, loadCsvFirstRowToArray } from "@common/utils/csv";
import { defaults } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { importMetadataThunk } from "../../../reducers/metadata/metadata-thunk";
import type {
  FieldsConfigChangeHandler,
  FilePathPickedHandler,
  ImportModalState,
  MetadataImportConfig,
  OptionChangeHandler,
} from "./MetadataModalTypes";

const defaultConfig = {
  delimiter: ",",
};

interface UseMetadataImportReturn {
  fieldsConfig: MetadataImportConfig;
  importMetadata: () => void;
  metadataConfig: LoadCsvFileToArrayOptions;
  metadataRow?: Record<string, string>;
  onFieldsConfigChange: FieldsConfigChangeHandler;
  onOptionChange: OptionChangeHandler;
  onPathChange: FilePathPickedHandler;
  path: string;
  state: ImportModalState;
}

export const useMetadataImport = (): UseMetadataImportReturn => {
  const [path, setPath] = useState("");
  const [state, setState] = useState<ImportModalState>("view");
  const dispatch = useDispatch();

  const [metadataRow, setMetadataRow] = useState<
    Record<string, string> | undefined
  >();

  const [metadataConfig, setMetadataConfig] =
    useState<LoadCsvFileToArrayOptions>(defaultConfig);

  const [fieldsConfig, setFieldsConfig] = useState<MetadataImportConfig>({
    entityIdKey: "",
    fields: [],
  });

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

    const fields = Object.keys(row ?? {});
    setFieldsConfig({
      entityIdKey: fields[0] || "",
      fields,
    });
    setState("importPreview");
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

  const onFieldsConfigChange = (newFieldsConfig: MetadataImportConfig) => {
    setFieldsConfig(newFieldsConfig);
  };

  const importMetadata = async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(
      importMetadataThunk(path, {
        delimiter: metadataConfig.delimiter ?? ";",
        ...fieldsConfig,
      })
    );

    setState("view");
  };

  return {
    fieldsConfig,
    importMetadata,
    metadataConfig,
    metadataRow,
    onFieldsConfigChange,
    onOptionChange,
    onPathChange,
    path,
    state,
  };
};
