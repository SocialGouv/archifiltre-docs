import Button from "@material-ui/core/Button";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSearchMinus } from "react-icons/fa";

interface BackToRootProps {
  api: any;
  setNoFocus: any;
}

const BackToRoot: FC<BackToRootProps> = ({
  api: {
    icicle_state: { setNoDisplayRoot, isZoomed },
    undo: { commit },
  },
  setNoFocus,
}) => {
  const { t } = useTranslation();

  const backToRoot = useCallback(() => {
    setNoDisplayRoot();
    setNoFocus();
    commit();
  }, [setNoDisplayRoot, setNoFocus, commit]);

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={backToRoot}
      disabled={!isZoomed()}
      startIcon={<FaSearchMinus />}
    >
      {t("workspace.backToRoot")}
    </Button>
  );
};

export default BackToRoot;
