import React, { FC } from "react";
import styled from "styled-components";

const StyledAreaMessage = styled.span`
  font-family: QuickSand;
  font-size: 1.5em;
`;

/**
 * Standardized component for displaying messaged in a rounded area
 * @param children
 */
const AreaMessage: FC = ({ children }) => (
  <StyledAreaMessage>{children}</StyledAreaMessage>
);

export default AreaMessage;
