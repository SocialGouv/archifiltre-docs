# Archifiltre

## Contributing

### Launching the app

First install the dependencies

```bash
yarn
```

You should use autoreloading when developping, using

```bash
yarn devServer
```

and in another terminal :

```bash
yarn electron-server
```

and then, reload your electron app with the refresh command (`CMD + R` on OSX)

### Writing code

- Use JSDoc comments to document new functions.
- Try to keep you methods simple using meaningful function names and variable names. 

### Comitting

For our commits message, we are following [conventional commits](https://www.conventionalcommits.org).


### Code state

- We are migrating our data store from our custom framework to redux to make the code easier to apprehend by contributors.
- We are reworking components to isolate business logic into redux operations. This will allow cleaner code structure to make the app more maintainable.
- We are trying to change our components to functional components using hooks instead of class components.
- We are migrating our code to typescript to make it easier to maintain.

### CI

- We are making a CI platform on GitLab. We have a [mirrored repository](https://gitlab.factory.social.gouv.fr/SocialGouv/archifiltre) for that.

### Pull requests

If you want to contribute, you must respect our linter specs. You can run `yarn lint` for compliance test.

You are welcome to open pull requests to add features to the project.

We are trying to improve our test coverage, so you are welcome to test the services you are adding.

### Building/releasing the app.

First, prepare the build in production mode

```bash
yarn prepareProd
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
yarn buildProd
```

Once built, production binaries are found in the dist folder, each in their corresponding platform's subfolder.
