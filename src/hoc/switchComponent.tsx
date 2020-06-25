import React, { ComponentType } from "react";

type MapKey = string | number | symbol;

export type ComponentMap<Props extends object, Key extends MapKey> = {
  [key in Key]: ComponentType<Props>;
};

/**
 * Return a component that use the component in componentMap corresponding to the value returned by keySelector
 * @param componentMap
 * @param keySelector
 */
export const switchComponent = <
  ComponentProps extends object,
  Key extends MapKey
>(
  componentMap: ComponentMap<ComponentProps, Key>,
  keySelector: (props: ComponentProps) => Key
): React.ComponentType<ComponentProps> => (props) => {
  const key = keySelector(props);
  const SelectedComponent: React.ComponentType<ComponentProps> | undefined =
    componentMap[key];

  return SelectedComponent ? <SelectedComponent {...props} /> : null;
};
