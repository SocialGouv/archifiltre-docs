/**
 * Tests a value against "yes", 1, "1", "true" ignoring case.
 */
export const isTruthy = (v?: string): boolean =>
  !!v && ["yes", "true", "1"].includes(v.toLowerCase());

/**
 * Tests a value against "no", 0, "0", "false" ignoring case.
 */
export const isFalsy = (v?: string): boolean =>
  !v || ["no", "false", "0"].includes(v.toLowerCase());
