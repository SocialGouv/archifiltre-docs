import React from "react";
import { FaChevronDown } from "react-icons/fa";
import styled from "styled-components";
import { empty } from "../../../../util/function-util";
import Button from "../../../common/button";

const LanguageText = styled.span`
  text-transform: uppercase;
`;

const LanguageButton = ({ languageName, onClick = empty }) => (
  <Button id={`switch-to-${languageName}`} onClick={onClick}>
    <LanguageText>
      {languageName}
      {onClick === empty && (
        <>
          {" "}
          <FaChevronDown style={{ verticalAlign: "top" }} />
        </>
      )}
    </LanguageText>
  </Button>
);

export default LanguageButton;
