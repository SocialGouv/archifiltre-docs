import { openLink } from "@common/utils/electron/electron-util";
import useTheme from "@material-ui/core/styles/useTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { CONTACT_LINK } from "../../constants";
import type { ThemedProps } from "../../theme/default-theme";

const sendMailToArchifiltreTeam = () => {
  openLink(CONTACT_LINK);
};

const ContactLink = styled.a`
  cursor: pointer;
  color: ${({ theme }: ThemedProps) => theme.palette.primary.main};
`;

export const ContactUs: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <ContactLink
      onClick={() => {
        sendMailToArchifiltreTeam();
      }}
      theme={theme}
    >
      {t("common.contactUs")}
    </ContactLink>
  );
};
