import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";
import * as ObjectUtil from "util/object-util";

import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";

const Presentational = props => {
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
            props.toggleChangeWidthBySize,
            t("workspace.bySize"),
            !props.width_by_size,
            Color.parentFolder(),
            buttonStyle
          )}
        </TextAlignCenter>
      </div>
      <div className="cell small-4">
        <TextAlignCenter>
          {mkTB(
            props.toggleChangeWidthBySize,
            t("workspace.byNumber"),
            props.width_by_size,
            Color.parentFolder(),
            buttonStyle
          )}
        </TextAlignCenter>
      </div>
    </div>
  );
};

export default props => {
  const api = props.api;
  const icicle_state = api.icicle_state;

  props = ObjectUtil.compose(
    {
      width_by_size: icicle_state.widthBySize(),
      toggleChangeWidthBySize: icicle_state.toggleChangeWidthBySize
    },
    props
  );

  return <Presentational {...props} />;
};
