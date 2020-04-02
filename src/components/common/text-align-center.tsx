import React, { FC } from "react";
import styled from "styled-components";

const StyledTextAlignCenter = styled.div`
  text-align: center;
`;

const TextAlignCenter: FC = ({ children }) => (
  <StyledTextAlignCenter>{children}</StyledTextAlignCenter>
);

export default TextAlignCenter;
