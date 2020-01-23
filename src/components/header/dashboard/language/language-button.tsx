import React from "react";
import styled from "styled-components";
import { empty } from "../../../../util/function-util";
import Button from "../../../common/button";

const LanguageText = styled.span`
  text-transform: uppercase;
`;

const LanguageButton = ({ languageName, onClick = empty }) => (
  <Button id={`switch-to-${languageName}`} onClick={onClick}>
    <LanguageText>{languageName}</LanguageText>
  </Button>
);

export default LanguageButton;
