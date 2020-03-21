import React from "react";
import styled from "styled-components";
import Icon, { SEARCH_ICON } from "./icon";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0.5;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5em;

  &:hover {
    background-color: transparent;
    opacity: 1;
  }
`;

const ClickableIcon = (props) => (
  <Wrapper onClick={props.onClick}>
    <Icon {...props} />
    <Overlay>
      <Icon icon={SEARCH_ICON} color="black" />
    </Overlay>
  </Wrapper>
);

export default ClickableIcon;
