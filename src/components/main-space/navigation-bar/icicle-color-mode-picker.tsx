import React, { FC } from "react";
import { IcicleColorMode } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { useTranslation } from "react-i18next";
import OptionsPicker from "./options-picker";
import { FaPalette } from "react-icons/fa";

type IcicleColorModePickerProps = {
  icicleColorMode: IcicleColorMode;
  setIcicleColorMode: (mode: IcicleColorMode) => void;
};

const IcicleColorModePicker: FC<IcicleColorModePickerProps> = ({
  icicleColorMode,
  setIcicleColorMode,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      value: IcicleColorMode.BY_TYPE,
      label: t("workspace.type"),
    },
    {
      value: IcicleColorMode.BY_DATE,
      label: t("workspace.dates"),
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

export default IcicleColorModePicker;
