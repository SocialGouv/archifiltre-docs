import React from "react";
import { useTranslation } from "react-i18next";
import { FaPalette } from "react-icons/fa";

import { IcicleColorMode } from "../../../reducers/icicle-sort-method/icicle-sort-method-types";
import { OptionsPicker } from "./options-picker";

export interface IcicleColorModePickerProps {
  icicleColorMode: IcicleColorMode;
  setIcicleColorMode: (mode: IcicleColorMode) => void;
}

export const IcicleColorModePicker: React.FC<IcicleColorModePickerProps> = ({
  icicleColorMode,
  setIcicleColorMode,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      label: t("workspace.type"),
      value: IcicleColorMode.BY_TYPE,
    },
    {
      label: t("workspace.dates"),
      value: IcicleColorMode.BY_DATE,
    },
  ];

  return (
    <OptionsPicker
      title={t("workspace.coloring")}
      value={icicleColorMode}
      setValue={setIcicleColorMode}
      options={options}
      icon={<FaPalette />}
    />
  );
};
