import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Button, {
  ButtonAngles,
  ButtonColor,
  ButtonSize
} from "../common/button";
import { FaSearchMinus } from "react-icons/fa";

const Presentational = ({ backToRoot, isZoomed }) => {
  const { t } = useTranslation();

  return (
    <Button
      id="zoom-out-button"
      angles={ButtonAngles.ROUNDED}
      color={ButtonColor.ICICLE_ACTION}
      size={ButtonSize.SMALL}
      onClick={backToRoot}
      disabled={!isZoomed}
    >
      <span>
        <FaSearchMinus style={{ verticalAlign: "bottom" }} />
        &ensp;{t("workspace.backToRoot")}
      </span>
    </Button>
  );
};

const BackToRoot = ({
  api: {
    icicle_state: { setNoDisplayRoot, setNoFocus, isZoomed },
    undo: { commit }
  }
}) => {
  const backToRoot = useCallback(() => {
    setNoDisplayRoot();
    setNoFocus();
    commit();
  }, [setNoDisplayRoot, setNoFocus, commit]);

  return <Presentational isZoomed={isZoomed()} backToRoot={backToRoot} />;
};

export default BackToRoot;
