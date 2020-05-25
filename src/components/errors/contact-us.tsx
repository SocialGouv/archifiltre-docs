import useTheme from "@material-ui/core/styles/useTheme";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { shell } from "electron";
import styled from "styled-components";
import { ThemedProps } from "../../theme/default-theme";

const sendMailToArchifiltre = () => {
  shell.openExternal("mailto:archifiltre@sg.social.gouv.fr");
};

const ContactLink = styled.a<ThemedProps>`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const ContactUs: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <ContactLink onClick={() => sendMailToArchifiltre()} theme={theme}>
      {t("common.contactUs")}
    </ContactLink>
  );
};
