import React, { FC, MouseEventHandler } from "react";
import styled from "styled-components";
import { empty } from "../../util/function-util";
import ReactTooltip from "react-tooltip";

export enum ButtonColor {
  INFO = "#1779ba",
  SUCCESS = "#4d9e25",
  ERROR = "#e04d1c",
  ICICLE_ACTION = "#f99a0b",
  DISABLED = "#a8a8a8",
}

export enum ButtonWidth {
  WITH_SPACES = "90%",
}

export enum ButtonAngles {
  ROUNDED = "5px",
  CIRCLE = "50%",
}

export enum ButtonSize {
  SMALL,
  NORMAL,
}

const InnerButton = styled.button`
  display: inline-block;
  width: ${({ width = "100%" }) => width};
  vertical-align: middle;
  padding: ${({ size }) =>
    size === ButtonSize.SMALL ? "0.3em 0.45em" : "0.85em 1em"};
  border-radius: ${({ angles = ButtonAngles.ROUNDED }) => angles};
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
  tooltipText?: string;
}

const Button: FC<ButtonProps> = ({
  id = "",
  children,
  color = ButtonColor.SUCCESS,
  disabled = false,
  width,
  angles = ButtonAngles.ROUNDED,
  onClick = empty,
  size = ButtonSize.NORMAL,
  tooltipText = "",
}) => (
  <>
    <InnerButton
      id={id}
      color={color}
      data-test-id={id}
      disabled={disabled}
      width={width}
      angles={angles}
      size={size}
      onClick={onClick}
      data-tip={tooltipText}
      data-for={`${id}-tooltip`}
    >
      {children}
    </InnerButton>
    <ReactTooltip place="bottom" id={`${id}-tooltip`} />
  </>
);

export default Button;
