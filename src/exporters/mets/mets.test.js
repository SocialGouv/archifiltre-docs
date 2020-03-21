import {
  outputHeader,
  outputDmdSec,
  outputProvMd,
  outputFileTag,
  outputDivTag,
} from "./mets.test.data.json";
import {
  makeHeader,
  makeDmdSec,
  makePremisEvent,
  makeFileElement,
  makeObjectDiv,
} from "./mets";
import { advanceTo } from "jest-date-mock";

// We advance to a specific date for TransactedDate to be setup correctly
advanceTo(new Date(2019, 7, 5, 1, 0, 0, 0));
// Mock to give a defined value for the uuid
const mockUuid = "12345678-1234-1234-abcd-123456789abc";
jest.mock("uuid", () => ({
  v4: () => mockUuid,
}));

// BAD HACK to be able to compare 'undefined' values...
// The undefined values are needed in order to generate self-closed tags
outputFileTag["mets:file"][1]["mets:FLocat"][1] = undefined;
outputDivTag["mets:div"][1]["mets:fptr"][1] = undefined;

// Test suite
describe("mets module", () => {
  describe("with a given production identifier", () => {
    const testProductionIdentifier = "TEST_PRODUCTION_IDENTIFIER";
    it("should generate a proper metsHdr", () => {
      expect(makeHeader(testProductionIdentifier)).toEqual(outputHeader);
    });
  });
  describe("with an ID and a descriptive content", () => {
    const testId = "TEST_ID";
    const testContent = [{ "dc:title": "TEST" }];
    it("should generate a proper dmdSec", () => {
      expect(makeDmdSec(testId, testContent)).toEqual(outputDmdSec);
    });
  });
  describe("with an ID and a type", () => {
    const testId = "TEST_ID";
    const testTypeEvent = "testEvent";
    it("should generate a proper digiprovMD", () => {
      expect(makePremisEvent(testId, testTypeEvent)).toEqual(outputProvMd);
    });
  });

  describe("with an item, its ID, its associated DMDID and a hash", () => {
    const alias = "alias.test";
    const testItem = {
      name: "test.test",
      file_size: 100,
    };

    const testId = "TEST_ID";
    const testDmdId = "TEST_DMDID";
    const testmd5Hash = "123456789abcdef0123456789abcdef0";
    it("should generate a proper file section", () => {
      expect(
        makeFileElement(testItem, testId, testDmdId, testmd5Hash, alias)
      ).toStrictEqual(outputFileTag);
    });
  });

  describe("with an item, its ID, its Order and fileId", () => {
    const testId = "TEST_ID";
    const testOrder = 10;
    const testFileId = "master.10";
    it("should generate a proper file section", () => {
      expect(
        makeObjectDiv(undefined, undefined, testId, testOrder, testFileId)
      ).toEqual(outputDivTag);
    });
  });
});
