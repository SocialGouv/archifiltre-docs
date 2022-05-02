/**
 * Hack for union string litteral with string to keep autocomplete.
 */
export type UnknownMapping = string & { _?: never };

export type FilterMethod<T> = (element: T) => boolean;

/**
 * Force expand a type for debug purpose. Don't work on every type.
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-types
export type __DEBUG_TYPE__<T> = { [P in keyof T]: T[P] } & {};
