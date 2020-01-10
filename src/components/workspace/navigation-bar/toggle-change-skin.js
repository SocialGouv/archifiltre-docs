import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";

import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";

const Presentational = ({ toggleChangeSkin, change_skin }) => {
  const buttonStyle = {
    margin: 0,
    padding: "0.3em 10%",
    fontSize: "1em",
    fontWeight: "bold",
    borderRadius: "0.4em"
  };
  const { t } = useTranslation();
  return (
    <div className="grid-x align-middle" style={{ minWidth: "25em" }}>
      <div className="cell small-4">
        <TextAlignCenter>{t("workspace.colorCode")}</TextAlignCenter>
      </div>
      <div className="cell small-3">
        <TextAlignCenter>
          {mkTB(
            toggleChangeSkin,
            t("workspace.type"),
            change_skin,
            Color.parentFolder(),
            buttonStyle
          )}
        </TextAlignCenter>
      </div>
      <div className="cell small-3">
        <TextAlignCenter>
          {mkTB(
            toggleChangeSkin,
            t("workspace.dates"),
            !change_skin,
            Color.parentFolder(),
            buttonStyle
          )}
        </TextAlignCenter>
      </div>
    </div>
  );
};

const ToggleWidthBySize = ({
  api: {
    icicle_state: { changeSkin, toggleChangeSkin }
  }
}) => {
  return (
    <Presentational
      change_skin={changeSkin()}
      toggleChangeSkin={toggleChangeSkin}
    />
  );
};

export default ToggleWidthBySize;
