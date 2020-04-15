import React, { FC } from "react";
import styled from "styled-components";
import BreadcrumbPolyNew from "./breadcrumb-poly-new";

const BreadcrumbWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const BreadcrumbPolyWrapper = styled.div`
  width: 10%;
`;

const BreadcrumbTextWrapper = styled.div`
  width: 90%;
`;

export enum BreadcrumbOpacity {
  LOCKED = 1,
  HOVERED = 0.4,
}

interface BreadcrumbProps {
  label: string;
  active: boolean;
  opacity: BreadcrumbOpacity;
  color: string;
  isFirst: boolean;
  isLast: boolean;
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  isFirst,
  isLast,
  opacity,
  color,
}) => (
  <BreadcrumbWrapper>
    <BreadcrumbPolyWrapper>
      <BreadcrumbPolyNew
        isFirst={isFirst}
        isLast={isLast}
        opacity={opacity}
        color={color}
      />
    </BreadcrumbPolyWrapper>
    <BreadcrumbTextWrapper />
  </BreadcrumbWrapper>
);

export default Breadcrumb;
