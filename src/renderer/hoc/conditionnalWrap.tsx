import type { FC, ReactElement } from "react";
import { cloneElement } from "react";

interface ConditionalWrapProps {
  children: ReactElement;
  condition: boolean;
  wrap: (children: ReactElement) => ReactElement;
}

export const ConditionnalWrap: FC<ConditionalWrapProps> = ({
  condition,
  children,
  wrap,
}) => (condition ? cloneElement(wrap(children)) : children);
