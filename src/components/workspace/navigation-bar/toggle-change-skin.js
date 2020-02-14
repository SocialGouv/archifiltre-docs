import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";
import styled from "styled-components";
import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";
import Bubble from "../../header/dashboard/bubble";
import { FaChevronDown } from "react-icons/fa";

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

const ButtonTextWrapper = styled.span`
  display: flex;
`;

const ToggleButton = ({ toggleChangeSkin, changeSkin, label }) => {
  const buttonLabel = changeSkin ? (
    label
  ) : (
    <ButtonTextWrapper>
      {label} <FaChevronDown style={{ verticalAlign: "middle" }} />
    </ButtonTextWrapper>
  );
  return (
    <ButtonWrapper>
      {mkTB(
        toggleChangeSkin,
        buttonLabel,
        changeSkin,
        Color.parentFolder(),
        buttonStyle
      )}
    </ButtonWrapper>
  );
};

const Presentational = ({ toggleChangeSkin, changeSkin }) => {
  const { t } = useTranslation();
  return (
    <div className="grid-x align-middle" style={{ minWidth: "25em" }}>
      <div className="cell small-4">
        <TextAlignCenter>{t("workspace.colorCode")}</TextAlignCenter>
      </div>
      <div className="cell small-4">
        <Bubble
          comp={
            changeSkin ? (
              <ToggleButton
                toggleChangeSkin={toggleChangeSkin}
                changeSkin={!changeSkin}
                label={t("workspace.dates")}
              />
            ) : (
              <ToggleButton
                toggleChangeSkin={toggleChangeSkin}
                changeSkin={changeSkin}
                label={t("workspace.type")}
              />
            )
          }
          sub_comp={
            changeSkin ? (
              <ToggleButton
                toggleChangeSkin={toggleChangeSkin}
                changeSkin={changeSkin}
                label={t("workspace.type")}
              />
            ) : (
              <ToggleButton
                toggleChangeSkin={toggleChangeSkin}
                changeSkin={!changeSkin}
                label={t("workspace.dates")}
              />
            )
          }
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
    changeSkin={changeSkin()}
    toggleChangeSkin={toggleChangeSkin}
  />
);

export default ToggleWidthBySize;
