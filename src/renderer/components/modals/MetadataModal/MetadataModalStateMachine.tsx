import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import { loadCsvFirstRowToArray } from "@common/utils/csv";
import type { DoneInvokeEvent, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { notifyError } from "../../../utils/notifications";
import type { MetadataImportConfig } from "./MetadataModalTypes";

interface MetadataModalContext {
  config: LoadCsvFileToArrayOptions;
  fieldsConfig: MetadataImportConfig;
  filePath: string;
  firstRow: Record<string, string> | undefined;
}

const defaultConfig = {
  delimiter: ",",
};

const assertDelimiterIsValid = (config: LoadCsvFileToArrayOptions) => {
  if (config.delimiter === "") {
    throw new Error("Invalid Delimiter");
  }
};

interface FilePathPicked {
  filePath: string;
  type: "FILE_PATH_PICKED";
}

interface ConfigChanged {
  config: LoadCsvFileToArrayOptions;
  type: "CONFIG_CHANGED";
}

interface LoadMetadata {
  fieldsConfig: MetadataImportConfig;
  type: "LOAD_METADATA";
}

type Events =
  | ConfigChanged
  | FilePathPicked
  | LoadMetadata
  | { type: "ABORT" }
  | { type: "CONTINUE" }
  | { type: "FULFIL" }
  | { type: "IMPORT" }
  | { type: "REJECT" }
  | { type: "RETRY" };

export type MetadataModalState = StateFrom<typeof metadataModalMachine>;

export const metadataModalMachine = createMachine(
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
      events: {} as Events,
    },
    states: {
      importDropzone: {
        id: "importDropzone",
        on: {
          FILE_PATH_PICKED: {
            actions: assign<MetadataModalContext, FilePathPicked>({
              filePath: (context, event) => event.filePath,
            }),
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
        initial: "loading",
        on: {
          ABORT: "metadataView",
          CONFIG_CHANGED: {
            actions: [
              assign<MetadataModalContext, ConfigChanged>({
                config: (context, event) => event.config,
              }),
            ],
            target: "importPreview.loading",
          },
        },
        states: {
          loading: {
            invoke: {
              id: "loadPreview",
              onDone: {
                actions: assign<
                  MetadataModalContext,
                  DoneInvokeEvent<Record<string, string> | undefined>
                >({
                  firstRow: (context, event) => event.data,
                }),
                target: "view",
              },
              onError: {
                actions: ["notifyError"],
                target: "view",
              },
              src: "loadPreview",
            },
          },
          view: {
            on: {
              LOAD_METADATA: {
                actions: assign<MetadataModalContext, LoadMetadata>({
                  fieldsConfig: (context, event) => event.fieldsConfig,
                }),
                target: "#loadingMetadata",
              },
              RETRY: "#importDropzone",
            },
          },
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
            target: "importPreview.view",
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
      loadMetadata: async (context) => {
        assertDelimiterIsValid(context.config);
        return loadCsvFirstRowToArray(context.filePath, context.config);
      },
      loadPreview: (context) => async () => {
        assertDelimiterIsValid(context.config);
        return loadCsvFirstRowToArray(context.filePath, context.config);
      },
    },
  }
);
