import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import dateFormat from "dateformat";
import HelpTooltip from "../../common/help-tooltip";
import EditableField from "../../fields/editable-field";
import { useTranslation } from "react-i18next";
import { FOLDER_ICON, PAGE_ICON } from "../../common/icon";
import { octet2HumanReadableFormat } from "../../../util/file-system/file-sys-util";
import Typography from "@material-ui/core/Typography";
import BoundaryDate from "../../report/session-info/boundary-date";
import ElementCharacteristic from "./element-characteristic";
import { openExternalElement } from "../../../util/file-system/file-system-util";
import ClickableIcon from "../../common/clickable-icon";
import { useStyles } from "../../../hooks/use-styles";

export type ElementCharacteristicsContentProps = {
  elementName: string;
  elementAlias: string;
  elementSize: number;
  elementPath: string;
  minLastModifiedTimestamp: number;
  maxLastModifiedTimestamp: number;
  medianLastModifiedTimestamp: number;
  hash: string;
  isFolder: boolean;
  onElementNameChange: (name: string) => void;
  type: string;
};

const ElementCharacteristicsContent: FC<ElementCharacteristicsContentProps> = ({
  elementName,
  elementAlias,
  elementSize,
  elementPath,
  hash,
  isFolder,
  minLastModifiedTimestamp,
  maxLastModifiedTimestamp,
  medianLastModifiedTimestamp,
  onElementNameChange,
  type,
}) => {
  const { t } = useTranslation();
  const { body2Box } = useStyles();

  const openElement = () => openExternalElement(elementPath);

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between">
      <Box marginY={0.5}>
        <Box display="flex">
          <Box marginRight={2}>
            <Box className={body2Box}>
              {isFolder ? (
                <ClickableIcon
                  onClick={openElement}
                  icon={FOLDER_ICON}
                  color="black"
                />
              ) : (
                <ClickableIcon
                  onClick={openElement}
                  icon={PAGE_ICON}
                  color="black"
                />
              )}
            </Box>
          </Box>
          {elementName !== "" && (
            <Box width="100%">
              <Box>
                <EditableField
                  trimValue={true}
                  selectTextOnFocus={true}
                  value={elementAlias || elementName}
                  onChange={onElementNameChange}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">
                  ({elementAlias ? elementName : t("report.initialName")})
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box display="flex">
        <Box marginY={0.5}>
          <ElementCharacteristic
            name={t("report.size")}
            value={octet2HumanReadableFormat(elementSize)}
          />
          <ElementCharacteristic
            name={
              <>
                {t("report.hash")}&nbsp;
                <HelpTooltip
                  tooltipText={
                    isFolder
                      ? t("report.folderHashExplanation")
                      : t("report.fileHashExplanation")
                  }
                />
              </>
            }
            value={hash}
          />
        </Box>
        <Box>
          <ElementCharacteristic name={t("report.type")} value={type} />
        </Box>
      </Box>
      <Box marginY={0.5}>
        <Box>
          <Typography variant="h5">{t("report.lastModifications")}</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item>
            <BoundaryDate
              title={t("report.minimum")}
              content={dateFormat(minLastModifiedTimestamp, "dd/mm/yyyy")}
            />
          </Grid>
          <Grid item>
            <BoundaryDate
              title={
                <>
                  {t("report.median")}&nbsp;
                  <HelpTooltip tooltipText={t("report.medianExplanation")} />
                </>
              }
              content={dateFormat(maxLastModifiedTimestamp, "dd/mm/yyyy")}
            />
          </Grid>
          <Grid item>
            <BoundaryDate
              title={t("report.maximum")}
              content={dateFormat(medianLastModifiedTimestamp, "dd/mm/yyyy")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ElementCharacteristicsContent;
