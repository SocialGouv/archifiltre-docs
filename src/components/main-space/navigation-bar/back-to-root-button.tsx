import Button from "@material-ui/core/Button";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSearchMinus } from "react-icons/fa";

type BackToRootProps = {
  isZoomed: boolean;
  setNoFocus: any;
  resetZoom: () => void;
};

const BackToRoot: FC<BackToRootProps> = ({
  isZoomed,
  resetZoom,
  setNoFocus,
}) => {
  const { t } = useTranslation();

  const backToRoot = useCallback(() => {
    resetZoom();
    setNoFocus();
  }, [resetZoom, setNoFocus]);

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={backToRoot}
      disabled={!isZoomed}
      startIcon={<FaSearchMinus />}
    >
      {t("workspace.backToRoot")}
    </Button>
  );
};

export default BackToRoot;
