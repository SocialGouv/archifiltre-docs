export const liftPromise = <Input, Output>(
  fun: (input: Input) => Output
): ((input: Promise<Input>) => Promise<Output>) => (promise: Promise<Input>) =>
  promise.then(fun);
