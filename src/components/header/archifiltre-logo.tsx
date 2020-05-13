import { Tooltip } from "@material-ui/core";
import { shell } from "electron";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import version, { versionName } from "../../version";
import { HelpLink } from "./help-link";

const ArchifiltreLogoWrapper = styled.span`
  line-height: 1.5em;
`;

const ArchifiltreLogoText = styled.div`
  font-size: 2em;
  letter-spacing: 0.16em;
`;

const ArchifiltreVersionText = styled.a`
  cursor: pointer;
  color: dodgerblue;
  font-size: 0.8em;
`;

const onClick = (event) => {
  event.preventDefault();
  shell.openExternal(`${ARCHIFILTRE_SITE_URL}/#changelog`);
};

const versionSubtitle = `v${version} ${versionName}`;

const ArchifiltreLogo: FC = () => {
  const { t } = useTranslation();
  const title = t("report.whatsNew");
  return (
    <ArchifiltreLogoWrapper>
      <ArchifiltreLogoText>
        <b>archifiltre</b>
      </ArchifiltreLogoText>
      <Tooltip title={title}>
        <ArchifiltreVersionText onClick={onClick} target="_blank" role="link">
          {versionSubtitle}
        </ArchifiltreVersionText>
      </Tooltip>
      <HelpLink />
    </ArchifiltreLogoWrapper>
  );
};

export default ArchifiltreLogo;
