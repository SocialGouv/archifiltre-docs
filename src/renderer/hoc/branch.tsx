import React, { type ComponentType } from "react";

export function branch<TProps>(
  condition: (props: TProps) => boolean,

  TrueComponent: ComponentType<TProps>,

  FalseComponent: ComponentType<TProps>,
): React.FC<TProps> {
  const Component: React.FC<TProps> = props =>
    condition(props) ? <TrueComponent {...props} /> : <FalseComponent {...props} />;

  Component.displayName = `branch(${TrueComponent.displayName}, ${FalseComponent.displayName})`;

  return Component;
}
