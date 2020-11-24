import React from "react";
import { ComponentType, FC } from "react";

export function branch<Props>(
  condition: (props: Props) => boolean,
  TrueComponent: ComponentType<Props>,
  FalseComponent: ComponentType<Props>
): FC<Props> {
  const Component = (props) =>
    condition(props) ? (
      <TrueComponent {...props} />
    ) : (
      <FalseComponent {...props} />
    );

  Component.displayName = `branch(${TrueComponent.displayName}, ${FalseComponent.displayName})`;

  return Component;
}
