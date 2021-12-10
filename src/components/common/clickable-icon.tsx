import React from "react";
import styled from "styled-components";

import type { IconProps } from "./icon";
import { Icon, SEARCH_ICON } from "./icon";

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

export const ClickableIcon: React.FC<IconProps> = (props) => (
    <Wrapper onClick={props.onClick}>
        <Icon {...props} />
        <Overlay>
            <Icon icon={SEARCH_ICON} color="black" />
        </Overlay>
    </Wrapper>
);
