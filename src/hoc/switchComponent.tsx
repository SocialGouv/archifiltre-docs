import type { ComponentType } from "react";
import React from "react";

type MapKey = number | string | symbol;

export type ComponentMap<TProps, TKey extends MapKey> = {
  [key in TKey]?: ComponentType<TProps>;
};

/**
 * Return a component that use the component in componentMap corresponding to the value returned by keySelector
 */
export const switchComponent = <TComponentProps, TKey extends MapKey>(
  componentMap: ComponentMap<TComponentProps, TKey>,
  keySelector: (props: TComponentProps) => TKey
): React.ComponentType<TComponentProps> => {
  const SwitchedComponent: React.FC<TComponentProps> = (props) => {
    const key = keySelector(props);
    const SelectedComponent: React.ComponentType<TComponentProps> | undefined =
      componentMap[key];

    return SelectedComponent ? <SelectedComponent {...props} /> : null;
  };
  return SwitchedComponent;
};
