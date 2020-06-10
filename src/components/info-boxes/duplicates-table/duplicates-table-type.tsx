import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import { colors } from "util/color/color-util";

type DuplicatesTableTypeProps = {
  fileType: string;
};

const DuplicatesTableType: FC<DuplicatesTableTypeProps> = ({ fileType }) => {
  const { t } = useTranslation();
  return (
    <div>
      <FaCircle
        style={{
          color: colors[fileType],
          verticalAlign: "middle",
        }}
      />
      &nbsp;
      {t(`common.fileTypes.${fileType}`)}
    </div>
  );
};

export default DuplicatesTableType;
