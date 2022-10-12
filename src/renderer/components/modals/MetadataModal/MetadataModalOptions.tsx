import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { noop } from "lodash";
import type { ChangeEventHandler, FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import type { FileConfigChangeHandler } from "./MetadataModalTypes";

export interface ImportModalOptionsProps {
  onChange?: FileConfigChangeHandler;
  options?: LoadCsvFileToArrayOptions;
}

export const MetadataModalOptions: FC<ImportModalOptionsProps> = ({
  options,
  onChange = noop,
}) => {
  const { t } = useTranslation();

  function getValue<T extends keyof LoadCsvFileToArrayOptions>(
    key: keyof LoadCsvFileToArrayOptions
  ): LoadCsvFileToArrayOptions[T] | undefined {
    return options?.[key];
  }

  function onValueChange<T extends keyof LoadCsvFileToArrayOptions>(
    key: T
  ): ChangeEventHandler<HTMLInputElement> {
    return (event) => {
      onChange({
        ...options,
        [key]: event.target.value,
      });
    };
  }

  return (
    <Accordion>
      <AccordionSummary>
        <Typography>{t("importModal.advancedOptions")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <ListItem>
            <TextField
              label={t("importModal.delimiter")}
              value={getValue("delimiter")}
              name="delimiter"
              onChange={onValueChange("delimiter")}
            />
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
