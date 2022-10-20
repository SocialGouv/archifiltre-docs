import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import { detectConfig, loadCsvFirstRowToArray } from "@common/utils/csv";
import type { DoneInvokeEvent, State } from "xstate";
import { assign, createMachine } from "xstate";

import { notifyError } from "../../../utils/notifications";
import type { MetadataImportConfig } from "./MetadataModalTypes";

export interface MetadataModalContext {
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

interface FieldsConfigChanged {
  fieldsConfig: MetadataImportConfig;
  type: "FIELDS_CONFIG_CHANGED";
}

export type SimpleMetadataEvents =
  | { type: "ABORT" }
  | { type: "CONTINUE" }
  | { type: "FULFIL" }
  | { type: "IMPORT" }
  | { type: "LOAD_METADATA" }
  | { type: "REJECT" }
  | { type: "RETRY" };

export type MetadataEvents =
  | ConfigChanged
  | FieldsConfigChanged
  | FilePathPicked
  | SimpleMetadataEvents;

export type MetadataModalState = State<MetadataModalContext, MetadataEvents>;

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
        initial: "detectingConfig",
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
          detectingConfig: {
            invoke: {
              id: "detectConfig",
              onDone: {
                actions: assign<
                  MetadataModalContext,
                  DoneInvokeEvent<
                    Partial<LoadCsvFileToArrayOptions> | undefined
                  >
                >({
                  config: (context, event) => ({
                    ...context.config,
                    ...event.data,
                  }),
                }),
                target: "loading",
              },
              onError: {
                actions: ["notifyError"],
                target: "view",
              },
              src: "detectConfig",
            },
          },
          loading: {
            invoke: {
              id: "loadPreview",
              onDone: {
                actions: assign<
                  MetadataModalContext,
                  DoneInvokeEvent<Record<string, string> | undefined>
                >({
                  fieldsConfig: (context, event) => ({
                    entityIdKey: Object.keys(event.data ?? {})[0],
                    fields: Object.keys(event.data ?? {}),
                  }),
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
              FIELDS_CONFIG_CHANGED: {
                actions: assign<MetadataModalContext, FieldsConfigChanged>({
                  fieldsConfig: (context, event) => event.fieldsConfig,
                }),
              },
              LOAD_METADATA: {
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
      detectConfig:
        (context) => async (): Promise<Partial<LoadCsvFileToArrayOptions>> => {
          return detectConfig(context.filePath);
        },
      loadMetadata: (context) => async () => {
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
