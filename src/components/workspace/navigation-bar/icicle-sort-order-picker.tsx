import React, { FC, useCallback } from "react";

import { mkTB } from "components/buttons/button";

import TextAlignCenter from "components/common/text-align-center";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import styled from "styled-components";
import * as Color from "util/color-util";
import { IciclesSortMethod } from "../../../reducers/workspace-metadata/workspace-metadata-types";
import Bubble from "../../header/dashboard/bubble";

const buttonStyle = {
  borderRadius: "5px",
  fontSize: "1em",
  fontWeight: "bold",
  margin: 0,
  padding: "0.3em 10%"
};

const ButtonWrapper = styled.div`
  background-color: white;
  border-radius: 5px;
`;

const ButtonTextWrapper = styled.span`
  display: flex;
`;

const MenuButton = ({ isHeader, onClick, label }) => {
  const buttonLabel = isHeader ? (
    <ButtonTextWrapper>
      {label} <FaChevronDown style={{ verticalAlign: "middle" }} />
    </ButtonTextWrapper>
  ) : (
    label
  );
  return (
    <ButtonWrapper>
      {mkTB(onClick, buttonLabel, !isHeader, Color.parentFolder(), buttonStyle)}
    </ButtonWrapper>
  );
};

interface IciclesSortOrderPickerProps {
  iciclesSortMethod: IciclesSortMethod;
  setIciclesSortMethod: (sortMethod: IciclesSortMethod) => void;
}

const IciclesSortOrderPicker: FC<IciclesSortOrderPickerProps> = ({
  iciclesSortMethod,
  setIciclesSortMethod
}) => {
  const { t } = useTranslation();

  const sortByType = useCallback(
    () => setIciclesSortMethod(IciclesSortMethod.SORT_BY_TYPE),
    [setIciclesSortMethod]
  );
  const sortByDate = useCallback(
    () => setIciclesSortMethod(IciclesSortMethod.SORT_BY_DATE),
    [setIciclesSortMethod]
  );

  const byTypeButton = (
    <MenuButton
      isHeader={iciclesSortMethod === IciclesSortMethod.SORT_BY_TYPE}
      label={t("workspace.type")}
      onClick={sortByType}
    />
  );
  const byDateButton = (
    <MenuButton
      isHeader={iciclesSortMethod === IciclesSortMethod.SORT_BY_DATE}
      label={t("workspace.dates")}
      onClick={sortByDate}
    />
  );
  return (
    <div className="grid-x align-middle" style={{ minWidth: "25em" }}>
      <div className="cell small-4">
        <TextAlignCenter>{t("workspace.colorCode")}</TextAlignCenter>
      </div>
      <div className="cell small-4">
        <Bubble
          comp={
            iciclesSortMethod === IciclesSortMethod.SORT_BY_DATE
              ? byDateButton
              : byTypeButton
          }
          sub_comp={
            iciclesSortMethod === IciclesSortMethod.SORT_BY_DATE
              ? byTypeButton
              : byDateButton
          }
        />
      </div>
    </div>
  );
};

export default IciclesSortOrderPicker;
