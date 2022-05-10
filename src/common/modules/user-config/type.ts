import type { TrackAppId } from "../../tracker/type";

/**
 * Config for `ArchifiltreDocs@v1`
 */
interface UserConfigV1 {
  readonly _firstOpened: boolean;
  readonly appId: TrackAppId;
  // collectData: boolean;
  fullscreen: boolean;
  // locale: Locale;
}

export type UserConfigObject = UserConfigV1;

export type WritableUserConfigKeys = Exclude<
  keyof UserConfigV1,
  "_firstOpened" | "appId"
>;

export type UserConfigTypedKeys<
  T extends UserConfigObject[WritableUserConfigKeys]
> = {
  [P in WritableUserConfigKeys]: UserConfigV1[P] extends T ? P : never;
}[WritableUserConfigKeys];
