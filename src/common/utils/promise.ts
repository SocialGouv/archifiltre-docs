export const liftPromise =
  <TInput, TOutput>(
    fun: (input: TInput) => TOutput
  ): ((input: Promise<TInput>) => Promise<TOutput>) =>
  async (promise: Promise<TInput>) =>
    promise.then(fun);
