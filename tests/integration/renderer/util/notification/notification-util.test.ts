import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "@renderer/util/notification/notifications-util";
import noop from "lodash/noop";
import { NotificationManager } from "react-notifications";

jest.mock("react-notifications", () => ({
  NotificationManager: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

describe.skip("notification-util", () => {
  describe("notifySuccess", () => {
    it("should call the notification library with the right args", () => {
      const notificationMessage = "notificationMessage";
      const notificationTitle = "notificationTitle";
      const expectedTimeout = 10000;
      const callback = noop;
      notifySuccess(notificationMessage, notificationTitle);

      const successMock = NotificationManager.success as jest.Mock;

      expect(successMock).toHaveBeenCalledWith(
        notificationMessage,
        notificationTitle,
        expectedTimeout,
        callback
      );
    });
  });

  describe("notifyError", () => {
    it("should call the notification library with the right args", () => {
      const notificationMessage = "notificationMessage";
      const notificationTitle = "notificationTitle";
      const expectedTimeout = 10000;
      const callback = noop;
      notifyError(notificationMessage, notificationTitle);

      const errorMock = NotificationManager.error as jest.Mock;

      expect(errorMock).toHaveBeenCalledWith(
        notificationMessage,
        notificationTitle,
        expectedTimeout,
        callback
      );
    });
  });

  describe("notifyInfo", () => {
    it("should call the notification library with the right args", () => {
      const notificationMessage = "notificationMessage";
      const notificationTitle = "notificationTitle";
      const expectedTimeout = 10000;
      const callback = noop;
      notifyInfo(notificationMessage, notificationTitle);

      const infoMock = NotificationManager.info as jest.Mock;

      expect(infoMock).toHaveBeenCalledWith(
        notificationMessage,
        notificationTitle,
        expectedTimeout,
        callback
      );
    });
  });
});
