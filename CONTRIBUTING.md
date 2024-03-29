# Contributing

## Launching the app

First install the dependencies

```bash
yarn
```

Then copy the example env file

```bash
cp .env.example .env
```

(Optionnal) Install the React Developper Tools in your chrome browser. Then, find the extension install path and add it to the .env file. More info [here](https://electronjs.org/docs/tutorial/devtools-extension). You must provide the absolute path.


You should use autoreloading when developping, using

```bash
yarn dev
```

and in another terminal, to launch the electron app:

```bash
yarn dev-app
```

and then, reload your electron app with the refresh command (`CMD + R` on OS X)

You can make the app automatically load a specific folder by doing:

```bash
yarn dev --autoload /absolute/or/relative/path/to/folder
```


## Writing code

- Use JSDoc comments to document new functions.
- Try to keep you methods simple using meaningful function names and variable names. 

## Comitting

For our commits message, we are following [conventional commits](https://www.conventionalcommits.org).

## Tests

### Unit tests

You can run unit tests by running

```bash
yarn test
```

### e2e tests

You can run end-to-end tests by running

```bash
yarn e2e
```

E2E tests may fail after you installed new dependencies. You can fix it by doing

```bash
yarn install --force
```

## Resource consuming tasks

When doing heavy resource consuming tasks, we use NodeJS `childProcess.fork` method to keep the UI reactive. To do so,
we use [webpack-fork-loader](https://www.npmjs.com/package/webpack-fork-loader), which will wrap every `*.fork.js` or
`*.fork.ts` file into a ChildProcess constructor that will build a nodeJS ChildProcess element.

We added some utility classes to adapt the ChildProcess API to the formerly used WebWorkers API which can be found in
the `src/util/async-worker-util.ts` file.

A basic new ChildProcess would look like :

```typescript
// child-process.controller.ts
import MyChildProcess from "./child-process.fork.ts";
import { createAsyncWorkerForChildProcessControllerFactory } from "utils/async-worker/child-process";
import { MessageTypes } from "utils/batch-process/batch-process-utils-types";
import { cancelableBackgroundWorkerProcess$ } from "utils/batch-process/batch-process-utils";

export const runMyChildProcess = () => {
    // We build a factory that return the AsyncWorker object. The parameter is the child process file name
    const asyncProcessFactory = createAsyncWorkerForChildProcessControllerFactory("my-child-process.fork");

    const result$ = cancelableBackgroundWorkerProcess$({ data }, asyncProcessFactory);
    
    // use the result observable
}
```

```typescript
// my-child-process.fork.ts
import { MessageTypes } from "../utils/batch-process/batch-process-utils-types";
import { createAsyncWorkerForChildProcess } from "utils/async-worker/child-process";
import { setupChildWorkerListeners } from "utils/async-worker/async-worker-utils";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
    onInitialize: () => console.log("handleInitializeMessage"),
    onData: () => console.log("handleDataMessage"),
})
```

## Translations

Translations are managed using i18n json files in `src/translations/`. To make it easier for translators to work, we
created a script that allows to generate csv containing the english text (which is our reference) and another
language translation. This will simplify identifying the missing translations. To do that, simply run :

```bash
yarn generate-translation-csv
```

You will then find your translations csv in the `./translations` folder.

Once your translator filled the CSV, you can import it back. Assuming that the first column of the csv is the path,
the second your reference language and the following columns the translated languages, you can do, for a file that
contains french translation in the third column and german translation in the fourth:

```bash
yarn import-translation-csv ./translations/fr-de.csv fr de
```

## Pull requests

If you want to contribute, you must respect our linter specs. You can run `yarn lint` for compliance test.

You are welcome to open pull requests to add features to the project.

We are trying to improve our test coverage, so you are welcome to test the services you are adding.
