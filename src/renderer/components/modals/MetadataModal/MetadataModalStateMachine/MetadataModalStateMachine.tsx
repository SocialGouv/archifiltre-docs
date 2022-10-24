import type { CsvFileLoadingOptions } from "@common/utils/csv";
import {
  assertDelimiterIsValid,
  loadCsvFirstRowToArray,
} from "@common/utils/csv";
import { loadXlsxFirstRow } from "@common/utils/xlsx";
import type { State } from "xstate";
import { assign, createMachine } from "xstate";

import { notifyError } from "../../../../utils/notifications";
import { isCsvMetadataFileConfig } from "../MetadataModalCommon";
import type {
  CsvMetadataFileConfig,
  MetadataImportConfig,
  MetadataModalContext,
} from "../MetadataModalTypes";

const defaultConfig: CsvMetadataFileConfig = {
  delimiter: ",",
  type: "CSV",
};

interface FilePathPicked {
  filePath: string;
  type: "FILE_PATH_PICKED";
}

interface ConfigChanged {
  config: CsvFileLoadingOptions;
  type: "CONFIG_CHANGED";
}

interface FieldsConfigChanged {
  fieldsConfig: MetadataImportConfig;
  type: "FIELDS_CONFIG_CHANGED";
}

interface LoadMetadata {
  context: Partial<MetadataModalContext>;
  type: "LOAD_METADATA";
}

export type SimpleMetadataEvents =
  | { type: "ABORT" }
  | { type: "CONTINUE" }
  | { type: "FULFIL" }
  | { type: "IMPORT" }
  | { type: "REJECT" }
  | { type: "RETRY" };

export type MetadataEvents =
  | ConfigChanged
  | FieldsConfigChanged
  | FilePathPicked
  | LoadMetadata
  | SimpleMetadataEvents;

export type MetadataModalState = State<MetadataModalContext, MetadataEvents>;

const saveLoadedMetadata = assign<MetadataModalContext, LoadMetadata>(
  (context, event) => ({
    ...context,
    ...event.context,
  })
);

const saveFilePathPicked = assign<MetadataModalContext, FilePathPicked>({
  filePath: (context, event) => event.filePath,
});

export const metadataModalMachine = createMachine<
  MetadataModalContext,
  MetadataEvents
>(
  {
    context: {
      config: defaultConfig,
      fieldsConfig: {
        entityIdKey: "path",
        fields: [],
      },
      filePath: "",
      firstRow: {},
    },
    initial: "metadataView",
    predictableActionArguments: true,
    schema: {
      context: {} as MetadataModalContext,
      events: {} as MetadataEvents,
    },
    states: {
      importDropzone: {
        id: "importDropzone",
        on: {
          ABORT: "metadataView",
          FILE_PATH_PICKED: {
            actions: saveFilePathPicked,
            target: "importPreview",
          },
        },
      },
      importMetadata: {
        on: {
          ABORT: "metadataView",
          CONTINUE: "importPreview",
        },
      },
      importPreview: {
        on: {
          LOAD_METADATA: {
            actions: saveLoadedMetadata,
            target: "loadingMetadata",
          },
          RETRY: "importDropzone",
        },
      },
      loadingMetadata: {
        id: "loadingMetadata",
        invoke: {
          onDone: {
            target: "metadataView",
          },
          onError: {
            actions: "notifyError",
            target: "importPreview",
          },
          src: "loadMetadata",
        },
      },
      metadataView: {
        on: {
          IMPORT: "importDropzone",
        },
      },
    },
  },
  {
    actions: {
      notifyError: () => {
        notifyError("LoadingError", "LoadingError");
      },
    },
    services: {
      loadMetadata: (context) => async () => {
        if (isCsvMetadataFileConfig(context.config)) {
          assertDelimiterIsValid(context.config);
          return loadCsvFirstRowToArray(context.filePath, context.config);
        }
        return loadXlsxFirstRow(context.filePath, context.config.selectedSheet);
      },
    },
  }
);
