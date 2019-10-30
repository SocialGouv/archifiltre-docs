import { NotificationManager } from "react-notifications";
import { notifyError, notifyInfo, notifySuccess } from "./notifications-util";

jest.mock("react-notifications", () => ({
  NotificationManager: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn()
  }
}));

describe("notification-util", () => {
  describe("notifySuccess", () => {
    it("should call the notification library with the right args", () => {
      const notificationMessage = "notificationMessage";
      const notificationTitle = "notificationTitle";
      const expectedTimeout = 5000;
      notifySuccess(notificationMessage, notificationTitle);

      const successMock = NotificationManager.success as jest.Mock;

      expect(successMock).toHaveBeenCalledWith(
        notificationMessage,
        notificationTitle,
        expectedTimeout
      );
    });
  });

  describe("notifyError", () => {
    it("should call the notification library with the right args", () => {
      const notificationMessage = "notificationMessage";
      const notificationTitle = "notificationTitle";
      const expectedTimeout = 5000;
      notifyError(notificationMessage, notificationTitle);

      const errorMock = NotificationManager.error as jest.Mock;

      expect(errorMock).toHaveBeenCalledWith(
        notificationMessage,
        notificationTitle,
        expectedTimeout
      );
    });
  });

  describe("notifyInfo", () => {
    it("should call the notification library with the right args", () => {
      const notificationMessage = "notificationMessage";
      const notificationTitle = "notificationTitle";
      const expectedTimeout = 5000;
      notifyInfo(notificationMessage, notificationTitle);

      const infoMock = NotificationManager.info as jest.Mock;

      expect(infoMock).toHaveBeenCalledWith(
        notificationMessage,
        notificationTitle,
        expectedTimeout
      );
    });
  });
});
