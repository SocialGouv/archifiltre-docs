import {
  getEnumKeyFromValue,
  isValueInEnum,
  mapValueBetweenEnums
} from "./enum-util";

enum SourceEnum {
  FIRST_VALUE = "firstValue",
  SECOND_VALUE = "secondValue",
  THIRD_VALUE = "secondValue"
}

enum DestinationEnum {
  FIRST_VALUE = "firstValueFromDestination",
  SECOND_VALUE = "secondValueFromDestination",
  THIRD_VALUE = "secondValueFromDestination"
}

describe("enum-util", () => {
  describe("getFirstEnumKeyFromValue", () => {
    it("should return key from enum value", () => {
      const valueFromKey = getEnumKeyFromValue("secondValue", SourceEnum);
      expect(valueFromKey).toBe("SECOND_VALUE");
    });
  });
  describe("isValueInEnum", () => {
    it("should return a boolean indicating if boolean in enum", () => {
      expect(isValueInEnum("secondValue", SourceEnum)).toBe(true);
    });
  });
  describe("mapValueBetweenEnums", () => {
    it("should destinationEnum value from sourceEnum value", () => {
      const destinationEnumValue = mapValueBetweenEnums(
        "secondValue",
        SourceEnum,
        DestinationEnum
      );
      expect(destinationEnumValue).toBe("secondValueFromDestination");
    });
  });
});
