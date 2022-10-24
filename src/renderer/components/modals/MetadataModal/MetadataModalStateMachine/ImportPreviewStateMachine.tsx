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
  config: CsvFileLoadingOptions;
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
  fieldsConfig: (context, event) => ({
    entityIdKey: Object.keys(event.data ?? {})[0],
    fields: Object.keys(event.data ?? {}),
  }),
  firstRow: (context, event) => event.data,
});

const saveFieldConfig = assign<MetadataModalContext, FieldsConfigChanged>({
  fieldsConfig: (context, event) => event.fieldsConfig,
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
          FIELDS_CONFIG_CHANGED: {
            actions: saveFieldConfig,
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
