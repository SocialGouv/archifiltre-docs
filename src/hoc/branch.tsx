import type { ComponentType } from "react";
import React from "react";

export function branch<Props>(
    condition: (props: Props) => boolean,
    TrueComponent: ComponentType<Props>,
    FalseComponent: ComponentType<Props>
): React.FC<Props> {
    const Component = (props) =>
        condition(props) ? (
            <TrueComponent {...props} />
        ) : (
            <FalseComponent {...props} />
        );

    Component.displayName = `branch(${TrueComponent.displayName}, ${FalseComponent.displayName})`;

    return Component;
}
