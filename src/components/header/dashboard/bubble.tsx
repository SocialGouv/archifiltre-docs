import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  width: ${({ width }) => width};
`;

const SubComponent = styled.div`
  display: ${({ isMouseOver }) => (isMouseOver ? "initial" : "none")};
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 3;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ borderRadius }) => borderRadius};
`;

interface BubbleProps {
  comp;
  sub_comp;
  backgroundColor?: string;
  borderRadius?: string;
  width?: string;
}

const Bubble: FC<BubbleProps> = ({
  comp,
  sub_comp,
  backgroundColor = "",
  borderRadius = 0,
  width = "100%",
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const onMouseEnter = useCallback(() => setIsMouseOver(true), [
    setIsMouseOver,
  ]);
  const onMouseLeave = useCallback(() => setIsMouseOver(false), [
    setIsMouseOver,
  ]);

  return (
    <Container width={width}>
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {comp}
      </div>
      <SubComponent
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        isMouseOver={isMouseOver}
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
      >
        <div className="grid-x align-center">
          <div className="cell">{sub_comp}</div>
        </div>
      </SubComponent>
    </Container>
  );
};

export default Bubble;
