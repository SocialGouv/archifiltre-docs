import type { CsvFileLoadingOptions } from "@common/utils/csv";
import {
  assertDelimiterIsValid,
  loadCsvFirstRowToArray,
} from "@common/utils/csv";
import { loadXlsxFirstRow } from "@common/utils/xlsx";
import type { DoneInvokeEvent } from "xstate";
import { assign, createMachine } from "xstate";

import {
  detectCsvConfig,
  detectXlsxConfig,
  isCsvFile,
  isCsvMetadataFileConfig,
  isXlsxFile,
} from "../MetadataModalCommon";
import type {
  MetadataFileConfig,
  MetadataImportConfig,
  MetadataModalContext,
} from "../MetadataModalTypes";

interface ConfigChanged {
  config: MetadataFileConfig;
  type: "CONFIG_CHANGED";
}

interface FieldsConfigChanged {
  fieldsConfig: MetadataImportConfig;
  type: "FIELDS_CONFIG_CHANGED";
}

export type ImportPreviewSimpleEvents =
  | {
      type: "ABORT";
    }
  | {
      type: "LOAD_METADATA";
    }
  | {
      type: "RETRY";
    };

type Events = ConfigChanged | FieldsConfigChanged | ImportPreviewSimpleEvents;

type ImportFinalEvent = MetadataModalContext & {
  action: "import";
};

interface RetryFinalEvent {
  action: "retry";
}

export type ImportPreviewFinalEvent = ImportFinalEvent | RetryFinalEvent;

const saveDetectedConfig = assign<
  MetadataModalContext,
  DoneInvokeEvent<Partial<CsvFileLoadingOptions> | undefined>
>({
  config: (context, event) => ({
    ...context.config,
    ...event.data,
  }),
});

const saveLoadedPreview = assign<
  MetadataModalContext,
  DoneInvokeEvent<Record<string, string> | undefined>
>({
  fieldsConfig: (_, event) => ({
    entityIdKey: Object.keys(event.data ?? {})[0],
    fields: Object.keys(event.data ?? {}),
  }),
  firstRow: (_, event) => event.data,
});

const saveFieldConfig = assign<MetadataModalContext, FieldsConfigChanged>({
  fieldsConfig: (_, event) => event.fieldsConfig,
});

const saveFileConfig = assign<MetadataModalContext, ConfigChanged>({
  config: (_, event) => event.config,
});

export const importPreviewStateMachine = createMachine<
  MetadataModalContext,
  Events
>(
  {
    initial: "detectingConfig",
    predictableActionArguments: true,
    states: {
      detectingConfig: {
        invoke: {
          id: "detectConfig",
          onDone: {
            actions: saveDetectedConfig,
            target: "loading",
          },
          onError: {
            actions: ["notifyError"],
            target: "view",
          },
          src: "detectConfig",
        },
      },
      import: {
        data: (context): ImportPreviewFinalEvent => ({
          ...context,
          action: "import",
        }),
        type: "final",
      },
      loading: {
        invoke: {
          id: "loadPreview",
          onDone: {
            actions: saveLoadedPreview,
            target: "view",
          },
          onError: {
            actions: ["notifyError"],
            target: "view",
          },
          src: "loadPreview",
        },
      },
      retry: {
        data: {
          action: "retry",
        },
        type: "final",
      },
      view: {
        on: {
          CONFIG_CHANGED: {
            actions: saveFileConfig,
            target: "loading",
          },
          FIELDS_CONFIG_CHANGED: {
            actions: saveFieldConfig,
            target: "loading",
          },
          LOAD_METADATA: "import",
          RETRY: "retry",
        },
      },
    },
  },
  {
    services: {
      detectConfig:
        ({ filePath }) =>
        async (): Promise<MetadataFileConfig> => {
          if (isCsvFile(filePath)) {
            return detectCsvConfig(filePath);
          }
          if (isXlsxFile(filePath)) {
            return detectXlsxConfig(filePath);
          }
          throw new Error("Unsupported file extension");
        },
      loadPreview:
        ({ filePath, config }) =>
        async () => {
          if (isCsvMetadataFileConfig(config)) {
            assertDelimiterIsValid(config);
            return loadCsvFirstRowToArray(filePath, config);
          }
          return loadXlsxFirstRow(filePath, config.selectedSheet);
        },
    },
  }
);
