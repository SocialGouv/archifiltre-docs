import { sanitizeUserSettings } from "./persistent-settings";

describe("persistent-settings", () => {
  describe("sanitizeUserSettings", () => {
    describe("with an empty object", () => {
      it("should return default user settings", () => {
        expect(sanitizeUserSettings({})).toEqual({
          isTrackingEnabled: true,
          isMonitoringEnabled: true,
          language: "en",
        });
      });
    });
    describe("with an empty string", () => {
      it("should return default user settings", () => {
        expect(sanitizeUserSettings("")).toEqual({
          isTrackingEnabled: true,
          isMonitoringEnabled: true,
          language: "en",
        });
      });
    });
    describe("with undefined", () => {
      it("should return default user settings", () => {
        expect(sanitizeUserSettings(undefined)).toEqual({
          isTrackingEnabled: true,
          isMonitoringEnabled: true,
          language: "en",
        });
      });
    });
    describe("with valid user settings JSON", () => {
      it("should return default user settings", () => {
        expect(
          sanitizeUserSettings({
            isTrackingEnabled: false,
            isMonitoringEnabled: true,
            language: "fr",
          })
        ).toEqual({
          isTrackingEnabled: false,
          isMonitoringEnabled: true,
          language: "fr",
        });
      });
    });
    describe("with partial user settings JSON", () => {
      it("should return default user settings", () => {
        expect(
          sanitizeUserSettings({
            isMonitoringEnabled: false,
          })
        ).toEqual({
          isTrackingEnabled: true,
          isMonitoringEnabled: false,
          language: "en",
        });
      });
    });
  });
});
