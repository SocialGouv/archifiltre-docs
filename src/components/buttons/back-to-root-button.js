import React from "react";

import * as ObjectUtil from "util/object-util";
import { mkB } from "components/buttons/button";

import * as Color from "util/color-util";

import { useTranslation } from "react-i18next";

const Presentational = props => {
  const { t } = useTranslation();
  const buttonStyle = {
    transition: "all 0.2s ease-out",
    WebkitTransition: "all 0.2s ease-out",
    padding: "0.3em 0.45em",
    margin: "0",
    borderRadius: "2em"
  };

  return mkB(
    props.backToRoot,
    <span>
      <i className="fi-zoom-out" />
      &ensp;{t("workspace.backToRoot")}
    </span>,
    props.isZoomed,
    Color.parentFolder(),
    buttonStyle
  );
};

export default props => {
  const api = props.api;
  const icicle_state = api.icicle_state;

  const backToRoot = () => {
    icicle_state.setNoDisplayRoot();
    icicle_state.setNoFocus();
    api.undo.commit();
  };

  props = ObjectUtil.compose(
    {
      isZoomed: icicle_state.isZoomed(),
      backToRoot
    },
    props
  );

  return <Presentational {...props} />;
};
