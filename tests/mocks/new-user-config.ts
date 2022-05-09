import type { UserConfigObject } from "@common/modules/user-config/type";

const defaultConfig: UserConfigObject = {
  _firstOpened: true,
  appId: "testAppId",
  fullscreen: true,
};

jest.mock(
  "@common/modules/new-user-config",
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  (): typeof import("@common/modules/new-user-config") => ({
    get(key) {
      return defaultConfig[key];
    },
    getAll() {
      return defaultConfig;
    },

    initNewUserConfig: async () => Promise.resolve(),

    set(key, _value) {
      return defaultConfig[key];
    },
  })
);
