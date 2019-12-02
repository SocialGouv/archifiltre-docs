import { mkB } from "components/buttons/button";
import { useTranslation } from "react-i18next";

const ReinitButton = props => {
  const api = props.api;
  const database = api.database;
  const loading_state = api.loading_state;
  const icicle_state = api.icicle_state;
  const undo = api.undo;
  const { t } = useTranslation();
  const reInitStateApp = () => {
    database.reInit();
    loading_state.reInit();
    icicle_state.setNoFocus();
    icicle_state.setNoDisplayRoot();
    undo.commit();
  };

  return mkB(reInitStateApp, t("header.close"), true, "#e04d1c", {
    width: "90%"
  });
};

export default ReinitButton;
