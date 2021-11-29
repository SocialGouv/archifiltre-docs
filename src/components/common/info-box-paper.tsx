import type { PaperProps } from "@material-ui/core/Paper";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";

type InfoBoxPaperProps = PaperProps & {
    padding?: string;
};

export const InfoBoxPaper = styled(Paper)<InfoBoxPaperProps>`
    padding: ${({ padding }) => (padding ? padding : "10px")};
    height: 100%;
    box-sizing: border-box;
`;
