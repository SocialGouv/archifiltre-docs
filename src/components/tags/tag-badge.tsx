import React, { FC, MouseEventHandler } from "react";
import styled from "styled-components";
import { empty } from "../../util/function-util";

const TagBadgeContainer = styled.div`
  padding-right: 0;
  word-break: break-word;
`;

const TagBadgeContent = styled.button`
  height: 100%;
  color: white;
  background-color: ${({ color }) => color};
  border-radius: 0.5em;
  padding: 0 0.5em;
  cursor: ${({ onClick }) => (onClick === empty ? "default" : "pointer")};
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`;

export enum TagBadgeColor {
  TAG = "rgb(10, 50, 100)",
  DELETE = "rgb(250,0,0)"
}

interface TagBadgeProps {
  color?: TagBadgeColor;
  onClick?: MouseEventHandler;
  active?: boolean;
}

const TagBadge: FC<TagBadgeProps> = ({
  children,
  color = TagBadgeColor.TAG,
  onClick = empty,
  active = true
}) => (
  <TagBadgeContainer>
    <TagBadgeContent color={color} active={active} onClick={onClick}>
      {children}
    </TagBadgeContent>
  </TagBadgeContainer>
);

export default TagBadge;
