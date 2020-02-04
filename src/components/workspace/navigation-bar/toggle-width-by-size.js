import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";

import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Bubble from "../../header/dashboard/bubble";

const buttonStyle = {
  margin: 0,
  padding: "0.3em 10%",
  fontSize: "1em",
  fontWeight: "bold",
  borderRadius: "0.4em"
};

const ButtonWrapper = styled.div`
  background-color: white;
  border-radius: 5px;
`;

const Presentational = ({ toggleChangeWidthBySize, width_by_size }) => {
  const { t } = useTranslation();
  const bySizeButton = (
    <ButtonWrapper>
      {mkTB(
        toggleChangeWidthBySize,
        t("workspace.bySize"),
        !width_by_size,
        Color.parentFolder(),
        buttonStyle
      )}
    </ButtonWrapper>
  );
  const byNumberButton = (
    <ButtonWrapper>
      {mkTB(
        toggleChangeWidthBySize,
        t("workspace.byNumber"),
        width_by_size,
        Color.parentFolder(),
        buttonStyle
      )}
    </ButtonWrapper>
  );
  return (
    <div className="grid-x align-middle" style={{ minWidth: "25em" }}>
      <div className="cell small-4">
        <TextAlignCenter>{t("workspace.display")}</TextAlignCenter>
      </div>
      <div className="cell small-4">
        <Bubble
          comp={width_by_size ? bySizeButton : byNumberButton}
          sub_comp={width_by_size ? byNumberButton : bySizeButton}
        />
      </div>
    </div>
  );
};

const ToggleWidthBySize = ({
  api: {
    icicle_state: { widthBySize, toggleChangeWidthBySize }
  }
}) => (
  <Presentational
    width_by_size={widthBySize()}
    toggleChangeWidthBySize={toggleChangeWidthBySize}
  />
);

export default ToggleWidthBySize;
