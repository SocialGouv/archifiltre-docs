import useTheme from "@material-ui/core/styles/useTheme";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ThemedProps } from "../../theme/default-theme";
import { CONTACT_LINK } from "../../constants";
import { openLink } from "../../util/electron/electron-util";

const sendMailToArchifiltre = () => {
  openLink(CONTACT_LINK);
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
