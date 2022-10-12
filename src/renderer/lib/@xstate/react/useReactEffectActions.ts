/* eslint-disable */
import { useEffect, useLayoutEffect, useRef } from "react";
import type { EventObject, Interpreter, State } from "xstate";

import type { ActionStateTuple, ReactActionObject } from "./types";
import { ReactEffectType } from "./types";
import { partition } from "./utils";

function executeEffect<TContext, TEvent extends EventObject>(
  action: ReactActionObject<TContext, TEvent>,
  state: State<TContext, TEvent, any, any>
): void {
  const { exec } = action;
  const originalExec = exec(state.context, state._event.data, {
    _event: state._event,
    action,
    state,
  });

  originalExec();
}

export function useReactEffectActions<TContext, TEvent extends EventObject>(
  service: Interpreter<TContext, any, TEvent, any>
) {
  const effectActionsRef = useRef<
    [ReactActionObject<TContext, TEvent>, State<TContext, TEvent, any, any>][]
  >([]);
  const layoutEffectActionsRef = useRef<
    [ReactActionObject<TContext, TEvent>, State<TContext, TEvent, any, any>][]
  >([]);

  useLayoutEffect(() => {
    const sub = service.subscribe((currentState) => {
      if (currentState.actions.length) {
        const reactEffectActions = currentState.actions.filter(
          (action): action is ReactActionObject<TContext, TEvent> => {
            return (
              typeof action.exec === "function" &&
              "__effect" in (action as ReactActionObject<TContext, TEvent>).exec
            );
          }
        );

        const [effectActions, layoutEffectActions] = partition(
          reactEffectActions,
          (action): action is ReactActionObject<TContext, TEvent> => {
            return action.exec.__effect === ReactEffectType.Effect;
          }
        );

        effectActionsRef.current.push(
          ...effectActions.map<ActionStateTuple<TContext, TEvent>>(
            (effectAction) => [effectAction, currentState]
          )
        );

        layoutEffectActionsRef.current.push(
          ...layoutEffectActions.map<ActionStateTuple<TContext, TEvent>>(
            (layoutEffectAction) => [layoutEffectAction, currentState]
          )
        );
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  // this is somewhat weird - this should always be flushed within useLayoutEffect
  // but we don't want to receive warnings about useLayoutEffect being used on the server
  // so we have to use `useLayoutEffect` to silence those warnings
  useLayoutEffect(() => {
    while (layoutEffectActionsRef.current.length) {
      const [layoutEffectAction, effectState] =
        layoutEffectActionsRef.current.shift()!;

      executeEffect(layoutEffectAction, effectState);
    }
  }); // https://github.com/davidkpiano/xstate/pull/1202#discussion_r429677773

  useEffect(() => {
    while (effectActionsRef.current.length) {
      const [effectAction, effectState] = effectActionsRef.current.shift()!;

      executeEffect(effectAction, effectState);
    }
  });
}
