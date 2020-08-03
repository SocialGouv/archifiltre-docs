import React, { FC } from "react";
import styled from "styled-components";

const ArchifiltreLogoText = styled.div`
  font-size: 2rem;
  letter-spacing: 0.16rem;
`;

const ArchifiltreLogo: FC = () => {
  return (
    <ArchifiltreLogoText>
      <b>archifiltre</b>
    </ArchifiltreLogoText>
  );
};

export default ArchifiltreLogo;
