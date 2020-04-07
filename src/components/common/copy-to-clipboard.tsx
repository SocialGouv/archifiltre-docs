import { clipboard } from "electron";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaClipboardCheck, FaRegClipboard } from "react-icons/fa";
import {
  NotificationDuration,
  notifyInfo,
} from "../../util/notifications-util";

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

  return (
    <div className="copy-to-clipboard" style={{ width: "20px" }}>
      {isCopied ? <FaClipboardCheck /> : <FaRegClipboard onClick={onClick} />}
    </div>
  );
};
