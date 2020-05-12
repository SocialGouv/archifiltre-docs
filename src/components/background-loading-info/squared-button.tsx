import withTheme from "@material-ui/core/styles/withTheme";
import styled from "styled-components";
import { ThemedProps } from "../../theme/default-theme";

const SquaredButton = withTheme(styled.button<ThemedProps>`
  width: 37px;
  height: 37px;
  line-height: 37px;
  font-size: 18px;
  vertical-align: middle;
  text-align: center;
  color: ${({ theme }) => theme.palette.primary.main};
  cursor: pointer;
  background-color: white;
  border: none;
`);

export default SquaredButton;
