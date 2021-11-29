export const liftPromise =
    <Input, Output>(
        fun: (input: Input) => Output
    ): ((input: Promise<Input>) => Promise<Output>) =>
    async (promise: Promise<Input>) =>
        promise.then(fun);
