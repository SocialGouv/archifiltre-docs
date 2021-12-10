export type Filter<T> = (value: T) => boolean;

/**
 * Generate a filter function that check if the property propName contains propValue
 */
export const makeFilterByProp = <T>(
    propName: keyof T,
    propValue: string
): Filter<T> => {
    const sanitizedValue = propValue.trim().toLowerCase();
    return (row: T): boolean => {
        const comparedValue = row[propName];
        return typeof comparedValue === "string"
            ? comparedValue.toLowerCase().includes(sanitizedValue)
            : false;
    };
};
