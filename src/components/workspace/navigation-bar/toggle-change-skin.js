import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";
import styled from "styled-components";
import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";
import Bubble from "../../header/dashboard/bubble";

const buttonStyle = {
  margin: 0,
  padding: "0.3em 10%",
  fontSize: "1em",
  fontWeight: "bold",
  borderRadius: "5px"
};

const ButtonWrapper = styled.div`
  background-color: white;
  border-radius: 5px;
`;

const Presentational = ({ toggleChangeSkin, change_skin }) => {
  const { t } = useTranslation();
  const byTypeButton = (
    <ButtonWrapper>
      {mkTB(
        toggleChangeSkin,
        t("workspace.type"),
        change_skin,
        Color.parentFolder(),
        buttonStyle
      )}
    </ButtonWrapper>
  );
  const byDateButton = (
    <ButtonWrapper>
      {mkTB(
        toggleChangeSkin,
        t("workspace.dates"),
        !change_skin,
        Color.parentFolder(),
        buttonStyle
      )}
    </ButtonWrapper>
  );
  return (
    <div className="grid-x align-middle" style={{ minWidth: "25em" }}>
      <div className="cell small-4">
        <TextAlignCenter>{t("workspace.colorCode")}</TextAlignCenter>
      </div>
      <div className="cell small-4">
        <Bubble
          comp={change_skin ? byDateButton : byTypeButton}
          sub_comp={change_skin ? byTypeButton : byDateButton}
        />
      </div>
    </div>
  );
};

const ToggleWidthBySize = ({
  api: {
    icicle_state: { changeSkin, toggleChangeSkin }
  }
}) => (
  <Presentational
    change_skin={changeSkin()}
    toggleChangeSkin={toggleChangeSkin}
  />
);

export default ToggleWidthBySize;
