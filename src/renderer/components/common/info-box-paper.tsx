import Paper, { type PaperProps } from "@mui/material/Paper";
import styled from "styled-components";

export type InfoBoxPaperProps = PaperProps & {
  padding?: string;
};

export const InfoBoxPaper = styled(Paper)<InfoBoxPaperProps>`
  padding: ${({ padding }) => (padding ? padding : "10px")};
  height: 100%;
  box-sizing: border-box;
`;
