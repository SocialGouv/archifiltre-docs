/* eslint-disable */
// eslint-disable-file
import { useLayoutEffect, useState } from "react";
import type {
  EventObject,
  Interpreter,
  InterpreterOptions,
  MachineOptions,
  Observer,
  StateMachine,
  Subscription,
  Typestate,
} from "xstate";
import {interpret, State} from "xstate";

import type {MaybeLazy} from "./types";
import useConstant from "./useConstant";
import type {UseMachineOptions} from "./useMachine";
import {useReactEffectActions} from "./useReactEffectActions";

// copied from core/src/utils.ts
// it avoids a breaking change between this package and XState which is its peer dep
function toObserver<T>(
  nextHandler: Observer<T> | ((value: T) => void),
  errorHandler?: (error: any) => void,
  completionHandler?: () => void
): Observer<T> {
  if (typeof nextHandler === "object") {
    return nextHandler;
  }

  const noop = () => void 0;

  return {
    complete: completionHandler || noop,
    error: errorHandler || noop,
    next: nextHandler,
  };
}

export function useInterpret<TContext,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { context: TContext; value: any }>(
  getMachine: MaybeLazy<StateMachine<TContext, any, TEvent, TTypestate>>,
  options: Partial<InterpreterOptions> &
    Partial<MachineOptions<TContext, TEvent>> &
    Partial<UseMachineOptions<TContext, TEvent>> = {},
  observerOrListener?:
    | Observer<State<TContext, TEvent, any, TTypestate>>
    | ((value: State<TContext, TEvent, any, TTypestate>) => void)
): Interpreter<TContext, any, TEvent, TTypestate> {
  const machine = useConstant(() => {
    return typeof getMachine === "function" ? getMachine() : getMachine;
  });

  if (
    process.env.NODE_ENV !== "production" &&
    typeof getMachine !== "function"
  ) {
    const [initialMachine] = useState(machine);

    if (getMachine !== initialMachine) {
      console.warn(
        "Machine given to `useMachine` has changed between renders. This is not supported and might lead to unexpected results.\n" +
        "Please make sure that you pass the same Machine as argument each time."
      );
    }
  }

  const {
    context,
    guards,
    actions,
    activities,
    services,
    delays,
    state: rehydratedState,
    ...interpreterOptions
  } = options;

  const service = useConstant(() => {
    const machineConfig = {
      actions,
      activities,
      context,
      delays,
      guards,
      services,
    };
    const machineWithConfig = machine.withConfig(machineConfig, () => ({
      ...machine.context,
      ...context,
    }));

    return interpret(machineWithConfig, {
      deferEvents: true,
      ...interpreterOptions,
    });
  });

  useLayoutEffect(() => {
    let sub: Subscription;
    if (observerOrListener) {
      // @ts-ignore
      sub = service.subscribe(toObserver(observerOrListener));
    }

    return () => {
      sub?.unsubscribe();
    };
  }, [observerOrListener]);

  useLayoutEffect(() => {
    service.start(
      rehydratedState ? (State.create(rehydratedState) as any) : undefined
    );

    return () => {
      service.stop();
    };
  }, []);

  // Make sure options are kept updated when they change.
  // This mutation assignment is safe because the service instance is only used
  // in one place -- this hook's caller.
  useLayoutEffect(() => {
    Object.assign(service.machine.options.actions, actions);
    Object.assign(service.machine.options.guards, guards);
    Object.assign(service.machine.options.activities, activities);
    Object.assign(service.machine.options.services, services);
    Object.assign(service.machine.options.delays, delays);
  }, [actions, guards, activities, services, delays]);

  // @ts-ignore
  useReactEffectActions(service);

  // @ts-ignore
  return service;
}
