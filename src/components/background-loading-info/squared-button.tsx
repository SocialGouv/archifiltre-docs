import styled from "styled-components";
import { SUCCESS_GREEN } from "../../util/color-util";

const SquaredButton = styled.button`
  width: 37px;
  height: 37px;
  line-height: 37px;
  font-size: 18px;
  vertical-align: middle;
  text-align: center;
  color: ${SUCCESS_GREEN};
  cursor: pointer;
  background-color: white;
  border: none;
`;

export default SquaredButton;
