import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import {
  assertDelimiterIsValid,
  detectConfig,
  loadCsvFirstRowToArray,
} from "@common/utils/csv";
import type { DoneInvokeEvent } from "xstate";
import { assign, createMachine } from "xstate";

import type { MetadataImportConfig } from "../MetadataModalTypes";
import type { MetadataModalContext } from "./MetadataModalStateMachine";

interface ConfigChanged {
  config: LoadCsvFileToArrayOptions;
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
  DoneInvokeEvent<Partial<LoadCsvFileToArrayOptions> | undefined>
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
        (context) => async (): Promise<Partial<LoadCsvFileToArrayOptions>> => {
          return detectConfig(context.filePath);
        },
      loadPreview: (context) => async () => {
        assertDelimiterIsValid(context.config);
        return loadCsvFirstRowToArray(context.filePath, context.config);
      },
    },
  }
);
