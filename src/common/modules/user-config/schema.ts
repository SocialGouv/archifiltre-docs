import type { Schema } from "electron-store";

import type { UserConfigObject } from "./type";

export const schema: Schema<UserConfigObject> = {
  _firstOpened: {
    type: "boolean",
  },
  appId: {
    readOnly: true,
    type: "string",
  },
  // TODO: later
  // collectData: {
  //     type: "boolean",
  // },
  fullscreen: {
    type: "boolean",
  },
  // TODO: later
  // locale: {
  //     enum: unreadonly(SupportedLocales),
  // },
} as const;
