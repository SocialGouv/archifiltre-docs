import { FC, memo } from "react";
import styled, { keyframes } from "styled-components";

type SpinnerProps = {
  color?: string;
};

const rotate = keyframes`
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
`;

const getColor = ({ color = "black" }) => color;

const Spinner: FC<SpinnerProps> = styled(styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(to right, ${getColor}, white);
  animation: ${rotate} 1.4s infinite linear;
`)`
  &:before {
    width: 60%;
    height: 60%;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
  }
  &:after {
    background: white;
    width: 60%;
    height: 60%;
    border-radius: 50%;
    content: "";
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

export default memo(Spinner);
