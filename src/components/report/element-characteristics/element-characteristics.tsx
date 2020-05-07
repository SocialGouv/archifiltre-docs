import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import dateFormat from "dateformat";
import EditableField from "../../fields/editable-field";
import { useTranslation } from "react-i18next";
import Icon, { FOLDER_ICON, PAGE_ICON } from "../../common/icon";
import { octet2HumanReadableFormat } from "../../../util/file-system/file-sys-util";
import { Typography } from "@material-ui/core";
import ElementCharacteristic from "./element-characteristic";

interface ElementCharacteristicsProps {
  elementName: string;
  elementOriginalName: string;
  elementSize: number;
  minLastModifiedTimestamp: number;
  maxLastModifiedTimestamp: number;
  medianLastModifiedTimestamp: number;
  hash: string;
  isFolder: boolean;
  onElementNameChange: (name: string) => void;
}

const ElementCharacteristics: FC<ElementCharacteristicsProps> = ({
  elementName,
  elementOriginalName,
  elementSize,
  hash,
  isFolder,
  minLastModifiedTimestamp,
  maxLastModifiedTimestamp,
  medianLastModifiedTimestamp,
  onElementNameChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between">
      <Box marginY={0.5}>
        <EditableField
          trimValue={true}
          selectTextOnFocus={true}
          value={elementName}
          onChange={onElementNameChange}
        />
        <Box display="flex">
          <Box marginRight={0.5}>
            <Typography variant="body2">
              {isFolder ? (
                <Icon icon={FOLDER_ICON} color="black" />
              ) : (
                <Icon icon={PAGE_ICON} color="black" />
              )}
            </Typography>
          </Box>
          {elementOriginalName !== "" && (
            <Box>
              <Box>
                <Typography variant="body2">{elementOriginalName}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  ({t("report.initialName")})
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box marginY={0.5}>
        <ElementCharacteristic
          name={t("report.size")}
          value={octet2HumanReadableFormat(elementSize)}
        />
        <ElementCharacteristic name={t("report.hash")} value={hash} />
      </Box>
      <Box marginY={0.5}>
        <Box>
          <Typography variant="h5">{t("report.lastModifications")}</Typography>
        </Box>
        <Box>
          <ElementCharacteristic
            name={t("report.minimum")}
            value={dateFormat(minLastModifiedTimestamp, "dd/mm/yyyy")}
          />
          <ElementCharacteristic
            name={t("report.median")}
            value={dateFormat(maxLastModifiedTimestamp, "dd/mm/yyyy")}
          />
          <ElementCharacteristic
            name={t("report.maximum")}
            value={dateFormat(medianLastModifiedTimestamp, "dd/mm/yyyy")}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ElementCharacteristics;
