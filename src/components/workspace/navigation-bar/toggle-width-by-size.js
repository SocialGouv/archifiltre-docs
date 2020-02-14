import React from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";

import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Bubble from "../../header/dashboard/bubble";
import { FaChevronDown } from "react-icons/fa";

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

const ButtonTextWrapper = styled.span`
  display: flex;
`;

const ToggleButton = ({ toggleChangeWidthBySize, widthBySize, label }) => {
  const buttonLabel = widthBySize ? (
    label
  ) : (
    <ButtonTextWrapper>
      {label} <FaChevronDown style={{ verticalAlign: "middle" }} />
    </ButtonTextWrapper>
  );
  return (
    <ButtonWrapper>
      {mkTB(
        toggleChangeWidthBySize,
        buttonLabel,
        widthBySize,
        Color.parentFolder(),
        buttonStyle
      )}
    </ButtonWrapper>
  );
};

const Presentational = ({ toggleChangeWidthBySize, widthBySize }) => {
  const { t } = useTranslation();
  return (
    <div className="grid-x align-middle" style={{ minWidth: "25em" }}>
      <div className="cell small-4">
        <TextAlignCenter>{t("workspace.display")}</TextAlignCenter>
      </div>
      <div className="cell small-4">
        <Bubble
          comp={
            widthBySize ? (
              <ToggleButton
                toggleChangeWidthBySize={toggleChangeWidthBySize}
                widthBySize={!widthBySize}
                label={t("workspace.bySize")}
              />
            ) : (
              <ToggleButton
                toggleChangeWidthBySize={toggleChangeWidthBySize}
                widthBySize={widthBySize}
                label={t("workspace.byNumber")}
              />
            )
          }
          sub_comp={
            widthBySize ? (
              <ToggleButton
                toggleChangeWidthBySize={toggleChangeWidthBySize}
                widthBySize={widthBySize}
                label={t("workspace.byNumber")}
              />
            ) : (
              <ToggleButton
                toggleChangeWidthBySize={toggleChangeWidthBySize}
                widthBySize={!widthBySize}
                label={t("workspace.bySize")}
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
    icicle_state: { widthBySize, toggleChangeWidthBySize }
  }
}) => (
  <Presentational
    widthBySize={widthBySize()}
    toggleChangeWidthBySize={toggleChangeWidthBySize}
  />
);

export default ToggleWidthBySize;
