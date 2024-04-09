/* eslint-disable @typescript-eslint/no-explicit-any */

export const getEnumKeyFromValue = (key: any, enumeration: any): typeof enumeration =>
  Object.keys(enumeration).find(enumKey => enumeration[enumKey] === key);

export const isValueInEnum = (value: any, enumeration: any) => Object.values(enumeration).includes(value);

export const mapValueBetweenEnums = (value: any, sourceEnum: any, destinationEnum: any): any => {
  if (isValueInEnum(value, destinationEnum)) {
    return value;
  }
  return destinationEnum[getEnumKeyFromValue(value, sourceEnum)] || null;
};
