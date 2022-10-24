import type { CsvFileLoadingOptions } from "@common/utils/csv";
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

import type { FileConfigChangeHandler } from "../MetadataModalTypes";

export interface ImportModalOptionsProps {
  onChange?: FileConfigChangeHandler;
  options?: CsvFileLoadingOptions;
}

export const CsvMetadataModalOptions: FC<ImportModalOptionsProps> = ({
  options,
  onChange = noop,
}) => {
  const { t } = useTranslation();

  const onDelimiterChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange({
      ...options,
      delimiter: event.target.value,
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
            <TextField
              label={t("importModal.delimiter")}
              value={options?.delimiter}
              name="delimiter"
              onChange={onDelimiterChange}
            />
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
