import type { FC, ReactElement } from "react";
import React from "react";

interface ConditionalWrapProps {
  children: ReactElement;
  condition: boolean;
  wrap: (children: ReactElement) => ReactElement;
}

export const ConditionnalWrap: FC<ConditionalWrapProps> = ({
  condition,
  children,
  wrap,
}) => (condition ? React.cloneElement(wrap(children)) : children);
