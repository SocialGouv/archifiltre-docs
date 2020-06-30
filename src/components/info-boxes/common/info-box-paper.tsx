import styled from "styled-components";
import Paper, { PaperProps } from "@material-ui/core/Paper";

type InfoBoxPaperProps = {
  padding?: string;
} & PaperProps;

const InfoBoxPaper = styled(Paper)<InfoBoxPaperProps>`
  padding: ${({ padding }) => (padding ? padding : "10px")};
  height: 100%;
  box-sizing: border-box;
`;

export default InfoBoxPaper;
