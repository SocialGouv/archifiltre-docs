import { sanitizeUserLocalSettings } from "@renderer/persistence/persistent-settings";

describe("persistent-settings", () => {
  describe("sanitizeUserSettings", () => {
    describe("with an empty object", () => {
      it("should return default user settings", () => {
        expect(sanitizeUserLocalSettings({})).toEqual({
          isMonitoringEnabled: true,
          isTrackingEnabled: true,
          language: "en",
        });
      });
    });
    describe("with undefined", () => {
      it("should return default user settings", () => {
        expect(sanitizeUserLocalSettings(undefined)).toEqual({
          isMonitoringEnabled: true,
          isTrackingEnabled: true,
          language: "en",
        });
      });
    });
    describe("with valid user settings JSON", () => {
      it("should return default user settings", () => {
        expect(
          sanitizeUserLocalSettings({
            isMonitoringEnabled: true,
            isTrackingEnabled: false,
            language: "fr",
          })
        ).toEqual({
          isMonitoringEnabled: true,
          isTrackingEnabled: false,
          language: "fr",
        });
      });
    });
    describe("with partial user settings JSON", () => {
      it("should return default user settings", () => {
        expect(
          sanitizeUserLocalSettings({
            isMonitoringEnabled: false,
          })
        ).toEqual({
          isMonitoringEnabled: false,
          isTrackingEnabled: true,
          language: "en",
        });
      });
    });
  });
});
