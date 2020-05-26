import styled from "styled-components";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import { FC } from "react";

const InfoBoxPaper: FC = styled(Paper)<PaperProps>`
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
`;

export default InfoBoxPaper;
