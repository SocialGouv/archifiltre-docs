import { clipboard } from "electron";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaClipboardCheck, FaRegClipboard } from "react-icons/fa";
import {
  NotificationDuration,
  notifyInfo,
} from "util/notification/notifications-util";

const COPIED_ICON_DISPLAY_DURATION = 3000;

export const CopyToClipboard = ({ stringToCopy }) => {
  const { t } = useTranslation();

  const [isCopied, setIsCopied] = useState(false);

  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      clipboard.writeText(stringToCopy);
      setIsCopied(true);
      notifyInfo(t("report.copied"), "", NotificationDuration.NORMAL);
    },
    [stringToCopy]
  );

  useEffect(() => setIsCopied(false), [setIsCopied, stringToCopy]);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(
        () => setIsCopied(false),
        COPIED_ICON_DISPLAY_DURATION
      );

      return () => clearTimeout(timeout);
    }
  }, [isCopied, setIsCopied]);

  return (
    <div className="copy-to-clipboard" style={{ width: "20px" }}>
      {isCopied ? <FaClipboardCheck /> : <FaRegClipboard onClick={onClick} />}
    </div>
  );
};
