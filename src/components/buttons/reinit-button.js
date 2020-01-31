import { mkB } from "components/buttons/button";
import { useTranslation } from "react-i18next";

const ReinitButton = ({ resetWorkspace }) => {
  const { t } = useTranslation();

  return mkB(resetWorkspace, t("header.close"), true, "#e04d1c", {
    width: "90%"
  });
};

export default ReinitButton;
