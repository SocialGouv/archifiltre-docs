export const getEnumKeyFromValue = (key, enumeration): typeof enumeration =>
  Object.keys(enumeration).find(enumKey => enumeration[enumKey] === key);

export const isValueInEnum = (value, enumeration) =>
  Object.values(enumeration).includes(value);

export const mapValueBetweenEnums = (value, sourceEnum, destinationEnum) => {
  if (isValueInEnum(value, destinationEnum)) {
    return value;
  }
  return destinationEnum[getEnumKeyFromValue(value, sourceEnum)] || null;
};
