import styled from "styled-components";

export enum TextSize {
  SMALL = "10px",
  DEFAULT = "12px",
}

interface TextInfoProps {
  bold?: boolean;
  uppercase?: boolean;
  size?: TextSize;
}

const TextInfo = styled.span<TextInfoProps>`
  font-size: ${({ size = TextSize.DEFAULT }) => size};
  font-family: Quicksand;
  font-weight: ${({ bold = true }) => (bold ? "bold" : "normal")};
  ${({ uppercase = false }) => (uppercase ? "text-transform: uppercase" : "")};
`;

export default TextInfo;
