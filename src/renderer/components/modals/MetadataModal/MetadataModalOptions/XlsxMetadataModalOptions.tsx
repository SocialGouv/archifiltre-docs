import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, MenuItem, Typography } from "@mui/material";
import Select from "@mui/material/Select";
import { type SelectInputProps } from "@mui/material/Select/SelectInput";
import { noop } from "lodash";
import React, { type FC } from "react";
import { useTranslation } from "react-i18next";

import { type FileConfigChangeHandler, type XlsMetadataFileConfig } from "../MetadataModalTypes";

export interface ImportModalOptionsProps {
  onChange?: FileConfigChangeHandler;
  options?: XlsMetadataFileConfig;
}

export const XlsxMetadataModalOptions: FC<ImportModalOptionsProps> = ({ options, onChange = noop }) => {
  const { t } = useTranslation();

  const onSelectedSheetChange: SelectInputProps["onChange"] = event => {
    onChange({
      type: "XLS",
      ...options,
      selectedSheet: event.target.value,
    });
  };

  return (
    <Accordion>
      <AccordionSummary>
        <Typography>{t("importModal.advancedOptions")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <ListItem>
            <Select value={options?.selectedSheet} onChange={onSelectedSheetChange}>
              {options?.sheets.map(label => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
