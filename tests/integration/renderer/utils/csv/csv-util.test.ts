import { arrayToCsv } from "@common/utils/csv";

const testSample = [
  ["00", "01"],
  ["10", "11"],
  ['2" "0', "21"],
];
const expectedResult = `"00";"01"
"10";"11"
"2"" ""0";"21"`;

describe("csv-utils", () => {
  describe("arrayToCsv", () => {
    it("should return the expected result", () => {
      expect(arrayToCsv(testSample)).toBe(expectedResult);
    });
  });
});
