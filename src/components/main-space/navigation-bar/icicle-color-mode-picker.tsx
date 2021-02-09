import React, { FC } from "react";
import { IcicleColorMode } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { useTranslation } from "react-i18next";
import OptionsPicker from "./options-picker";

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
      label: t("navigationBar.type"),
    },
    {
      value: IcicleColorMode.BY_DATE,
      label: t("navigationBar.dates"),
    },
  ];

  return (
    <OptionsPicker
      title={t("navigationBar.coloring")}
      value={icicleColorMode}
      setValue={setIcicleColorMode}
      options={options}
    />
  );
};

export default IcicleColorModePicker;
