# Archifiltre

## Import script

### Description

Archifiltre provides you with an export script that you can run directly on your file server. It allows you to generate
a file that can be directly sent to an archivist. He will then be able to drop it into Archifiltre to analyze the file
tree.

The generated file will contain the following information :
- The absolute path of the exported folder on your file system
- The filesystem on which the export was ran (unix or windows)
- The absolute path of every file in the exported folder
- The size of every file in the exported folder
- The lastModificationDate of every file in the exported folder
- The MD5 hash of every file in the exported folder

### Usage

#### Windows

Get the powershell script in `./scripts/load-from-filesystem.ps1`. Then, from a powershell command, run : 
```
load-from-filesystem.ps1 path-to-the-exported-folder > file-to-export-to
```

An export file will be created at the `file-to-export-to` location.

#### Unix or MacOS

Get the bash script in `./scripts/load-filesystem.sh`. Then, from a bash command, run :
```
./load-filesystem.sh path-to-the-exported-folder > file-to-export-to
```

An export file will be created at the `file-to-export-to` location.

If you encounter execution rights errors, run the following command to set the execution rights for the script :
```
chmod u+x ./load-filesystem.sh
```

## Contributing

### Launching the app

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


### Writing code

- Use JSDoc comments to document new functions.
- Try to keep you methods simple using meaningful function names and variable names. 

### Comitting

For our commits message, we are following [conventional commits](https://www.conventionalcommits.org).

### e2e tests

You can run end-to-end tests by running

```bash
yarn e2e
```

E2E tests may fail after you installed new dependencies. You can fix it by doing

```bash
yarn install --force
```

### Code state

- We are migrating our data store from our custom framework to redux to make the code easier to apprehend by contributors.
- We are reworking components to isolate business logic into redux operations. This will allow cleaner code structure to make the app more maintainable.
- We are trying to change our components to functional components using hooks instead of class components.
- We are migrating our code to typescript to make it easier to maintain.

### Resource consuming tasks

When doing heavy resource consuming tasks, we use NodeJS `childProcess.fork` method to keep the UI reactive. To do so,
we use [webpack-fork-loader](https://www.npmjs.com/package/webpack-fork-loader), which will wrap every `*.fork.js` or
`*.fork.ts` file into a ChildProcess constructor that will build a nodeJS ChildProcess element.

We added some utility classes to adapt the ChildProcess API to the formerly used WebWorkers API which can be found in
the `src/util/async-worker-util.ts` file.

A basic new ChildProcess would look like :

```typescript
// child-process.controller.ts
import MyChildProcess from "./child-process.fork.ts";
import { createAsyncWorkerControllerClass, AsyncWorkerEvent } from "../util/async-worker-util";
import { MessageTypes } from "../util/batch-process/batch-process-util-types";

export const runMyChildProcess = () => {
  // We build a "newable" entity which is easier to use if you need to spawn mutliple process
  const AsyncProcess = createAsyncWorkerControllerClass(MyChildProcess);

  const asyncProcess = new AsyncProcess();

  asyncProcess.postMessage({ type: MessageTypes.INITIALIZE, data: "hello" });
  asyncProcess.addEventListener(AsyncWorkerEvent.MESSAGE, (message) => { console.log("messageReceived", message) });
}
```
```typescript
// child-process.fork.ts
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess,
  fakeChildProcess
} from "../util/async-worker-util";
import { MessageTypes } from "../util/batch-process/batch-process-util-types";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.addEventListener(AsyncWorkerEvent.MESSAGE, ({ data, type }) => {
  if (type === MessageTypes.INITIALIZE) {
    asyncWorker.postMessage({ type: MessageTypes.RESULT, result: "hello" });
  }
});

// This export allows typescript compiler to not throw type errors. It will not really be used
// as it will be replaced by webpack-fork-loader
export default fakeChildProcess;
```

### Translations

Translations are managed using i18n json files in `src/translations/`. To make it easier for translators to work, we
created a script that allows to generate csv containing the english text (which is our reference) and another
language translation. This will simplify identifying the missing translations. To do that, simply run :

```bash
yarn generate-translation-csv
```

You will then find your translations csv in the `./translations` folder.

Once your translator filled the CSV, you can import it back. Assuming that the first column of the csv is the path,
the second your reference language and the following columns the translated languages, you can do, for a file that
contains french translation in the third column and german translation in the fourth :

```bash
yarn import-translation-csv ./translations/fr-de.csv fr de
```

### CI

- We are making a CI platform on GitLab. We have a [mirrored repository](https://gitlab.factory.social.gouv.fr/SocialGouv/archifiltre) for that.

### Pull requests

If you want to contribute, you must respect our linter specs. You can run `yarn lint` for compliance test.

You are welcome to open pull requests to add features to the project.

We are trying to improve our test coverage, so you are welcome to test the services you are adding.

### Building/releasing the app.

First, prepare the build in production mode

```bash
yarn prepare-prod
```

Then you can package the app for the right platform:

```bash
yarn win32
yarn win64
yarn mac
yarn linux
```

Or you can prepare the build and build for all four platforms with one command:

```bash
yarn build-prod
```

Once built, production binaries are found in the dist folder, each in their corresponding platform's subfolder.
