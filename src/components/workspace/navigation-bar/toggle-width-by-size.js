import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";
import * as ObjectUtil from "util/object-util";

import * as Color from "util/color-util";
import pick from "languages";

const display_code = pick({
  en: "Display:",
  fr: "Affichage :"
});

const by_size = pick({
  en: "By size",
  fr: "Par volume"
});

const by_number = pick({
  en: "By count",
  fr: "Par nombre"
});

const Presentational = props => {
  const button_style = {
    margin: 0,
    padding: "0.3em 10%",
    fontSize: "1em",
    fontWeight: "bold",
    borderRadius: "0.4em"
  };

  return (
    <div className="grid-x align-middle" style={{ minWidth: "25em" }}>
      <div className="cell small-4">
        <TextAlignCenter>{display_code}</TextAlignCenter>
      </div>
      <div className="cell small-4">
        <TextAlignCenter>
          {mkTB(
            props.toggleChangeWidthBySize,
            by_size,
            !props.width_by_size,
            Color.parentFolder(),
            button_style
          )}
        </TextAlignCenter>
      </div>
      <div className="cell small-4">
        <TextAlignCenter>
          {mkTB(
            props.toggleChangeWidthBySize,
            by_number,
            props.width_by_size,
            Color.parentFolder(),
            button_style
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
