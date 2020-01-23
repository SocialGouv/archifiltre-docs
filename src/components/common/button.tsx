import React, { FC, MouseEventHandler } from "react";
import styled from "styled-components";

export enum ButtonColor {
  SUCCESS = "#4d9e25"
}

const InnerButton = styled.button`
  display: inline-block;
  width: 100%;
  vertical-align: middle;
  padding: 0.85em 1em;
  border-radius: 0;
  font-family: inherit;
  font-size: 0.9rem;
  -webkit-appearance: none;
  line-height: 1;
  text-align: center;
  cursor: pointer;
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
`;

interface ButtonProps {
  id: string;
  color?: ButtonColor;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

const Button: FC<ButtonProps> = ({
  id = "",
  children,
  color = ButtonColor.SUCCESS,
  disabled = false,
  onClick
}) => (
  <InnerButton
    id={id}
    color={color}
    data-test-id={id}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </InnerButton>
);

export default Button;
