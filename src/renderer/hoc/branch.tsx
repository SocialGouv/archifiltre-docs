import type { ComponentType } from "react";
import React from "react";

export function branch<TProps>(
  condition: (props: TProps) => boolean,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  TrueComponent: ComponentType<TProps>,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FalseComponent: ComponentType<TProps>
): React.FC<TProps> {
  const Component: React.FC<TProps> = (props) =>
    condition(props) ? (
      <TrueComponent {...props} />
    ) : (
      <FalseComponent {...props} />
    );

  Component.displayName = `branch(${TrueComponent.displayName}, ${FalseComponent.displayName})`;

  return Component;
}
