import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";

import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";

const Presentational = ({ toggleChangeWidthBySize, width_by_size }) => {
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
        <TextAlignCenter>{t("workspace.display")}</TextAlignCenter>
      </div>
      <div className="cell small-4">
        <TextAlignCenter>
          {mkTB(
            toggleChangeWidthBySize,
            t("workspace.bySize"),
            !width_by_size,
            Color.parentFolder(),
            buttonStyle
          )}
        </TextAlignCenter>
      </div>
      <div className="cell small-4">
        <TextAlignCenter>
          {mkTB(
            toggleChangeWidthBySize,
            t("workspace.byNumber"),
            width_by_size,
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
    icicle_state: { widthBySize, toggleChangeWidthBySize }
  }
}) => {
  return (
    <Presentational
      width_by_size={widthBySize()}
      toggleChangeWidthBySize={toggleChangeWidthBySize}
    />
  );
};

export default ToggleWidthBySize;
