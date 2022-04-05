/**
 * Hack for union string litteral with string to keep autocomplete.
 */
export type UnknownMapping = string & { _?: never };

export type FilterMethod<T> = (element: T) => boolean;
