import React, { FC } from "react";
import styled from "styled-components";

const StyledAreaTitle = styled.h3`
  font-family: QuicksandBold;
  font-size: 1.5em;
`;

/**
 * Standardized component for displaying title in a rounded area
 * @param children
 */
const AreaTitle: FC = ({ children }) => (
  <StyledAreaTitle>{children}</StyledAreaTitle>
);

export default AreaTitle;
