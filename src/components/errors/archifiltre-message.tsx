import React, { FC } from "react";
import { ContactUs } from "./contact-us";
import styled from "styled-components";

const Grid = styled.div`
  padding: 0em 5em;
  height: 100%;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
`;

const ArchifiltreMessage: FC = ({ children }) => (
  <Grid className="grid-y grid-padding-x align-spaced align-middle">
    <Image alt="archifiltre-logo" src="imgs/archifiltre.png" />
    <h3>
      {children}
      <br />
      <br />
      <ContactUs />
    </h3>
  </Grid>
);

export default ArchifiltreMessage;
