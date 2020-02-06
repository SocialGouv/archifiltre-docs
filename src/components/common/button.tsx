import React, { FC, MouseEventHandler } from "react";
import styled from "styled-components";
import { empty } from "../../util/function-util";

export enum ButtonColor {
  INFO = "#1779ba",
  SUCCESS = "#4d9e25",
  ERROR = "#e04d1c",
  ICICLE_ACTION = "#f99a0b"
}

export enum ButtonWidth {
  WITH_SPACES = "90%"
}

export enum ButtonAngles {
  SQUARED,
  ROUNDED
}

export enum ButtonSize {
  SMALL,
  NORMAL
}

const InnerButton = styled.button`
  display: inline-block;
  width: ${({ width = "100%" }) => width};
  vertical-align: middle;
  padding: ${({ size }) =>
    size === ButtonSize.SMALL ? "0.3em 0.45em" : "0.85em 1em"};
  border-radius: ${({ angles }) =>
    angles === ButtonAngles.SQUARED ? 0 : "5px"};
  font-family: inherit;
  font-size: 0.9rem;
  -webkit-appearance: none;
  line-height: 1;
  text-align: center;
  cursor: ${({ onClick }) => (onClick === empty ? "default" : "pointer")};
  margin: 0;
  font-weight: bold;
  color: white;
  background-color: ${({ color }) => color};
  border: 1px solid ${({ color }) => color};
  transition: filter 0.25s ease-out;
  outline: none;
  &:hover {
    filter: brightness(120%);
  }
  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
  &:disabled:hover {
    filter: none;
  }
`;

interface ButtonProps {
  id: string;
  color?: ButtonColor;
  disabled?: boolean;
  width?: ButtonWidth;
  onClick?: MouseEventHandler;
  angles?: ButtonAngles;
  size?: ButtonSize;
}

const Button: FC<ButtonProps> = ({
  id = "",
  children,
  color = ButtonColor.SUCCESS,
  disabled = false,
  width,
  angles = ButtonAngles.SQUARED,
  onClick = empty,
  size = ButtonSize.NORMAL
}) => (
  <InnerButton
    id={id}
    color={color}
    data-test-id={id}
    disabled={disabled}
    width={width}
    angles={angles}
    size={size}
    onClick={onClick}
  >
    {children}
  </InnerButton>
);

export default Button;
