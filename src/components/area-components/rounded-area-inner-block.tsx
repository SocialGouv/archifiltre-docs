import React, { FC } from "react";
import styled from "styled-components";

const StyledRoundedAreaInnerBlock = styled.div`
  padding: 30px;
`;

/**
 * Padded inner block for the rounded area
 * @param children
 */
const RoundedAreaInnerBlock: FC = ({ children }) => (
  <StyledRoundedAreaInnerBlock>{children}</StyledRoundedAreaInnerBlock>
);

export default RoundedAreaInnerBlock;
