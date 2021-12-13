/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
export const getEnumKeyFromValue = (
    key: any,
    enumeration: any
): typeof enumeration =>
    Object.keys(enumeration).find((enumKey) => enumeration[enumKey] === key);

export const isValueInEnum = (value: any, enumeration: any) =>
    Object.values(enumeration).includes(value);

export const mapValueBetweenEnums = (
    value: any,
    sourceEnum: any,
    destinationEnum: any
): any => {
    if (isValueInEnum(value, destinationEnum)) {
        return value;
    }
    return destinationEnum[getEnumKeyFromValue(value, sourceEnum)] || null;
};
