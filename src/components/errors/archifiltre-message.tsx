import React, { FC } from "react";
import { ContactUs } from "./contact-us";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";

const StyledGrid = styled(Grid)`
  padding: 0em 5em;
  height: 100%;
`;

const Image = styled.img`
  width: 222px;
  height: 33px;
`;

const ArchifiltreMessage: FC = ({ children }) => (
  <StyledGrid container alignItems="center">
    <Image alt="archifiltre-logo" src="imgs/logo.png" />
    <h3>
      {children}
      <br />
      <br />
      <ContactUs />
    </h3>
  </StyledGrid>
);

export default ArchifiltreMessage;
