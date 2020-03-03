import React, { FC } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import styled from "styled-components";
import version from "../../version";
import { HelpLink } from "./help-link";
import WhatsNewLink from "./whats-new-link";

const ArchifiltreLogoWrapper = styled.span`
  line-height: 1.5em;
`;

const ArchifiltreLogoText = styled.div`
  font-size: 2em;
`;

const ArchifiltreVersionText = styled.div`
  font-size: 0.7em;
`;

const versionSubtitle = `v${version} Optimistic Otter`;

const ArchifiltreLogo: FC = () => (
  <ArchifiltreLogoWrapper>
    <ArchifiltreLogoText>
      <b>archifiltre</b> <HelpLink />
    </ArchifiltreLogoText>
    <ArchifiltreVersionText>
      {versionSubtitle} {" • "} <WhatsNewLink />
    </ArchifiltreVersionText>
  </ArchifiltreLogoWrapper>
);

export default ArchifiltreLogo;
