<h1 align="center">
  <p align="center">Archifiltre</p>
</h1>

<p align="center">
  <a href="https://github.com/SocialGouv/archifiltre/actions/"><img src="https://github.com/SocialGouv/archifiltre/workflows/CI/badge.svg" alt="Github Master CI Status"></a>
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache--2.0-yellow.svg" alt="License: Apache-2.0"></a>
  <a href="https://img.shields.io/github/v/release/SocialGouv/archifiltre"><img src="https://img.shields.io/github/v/release/SocialGouv/archifiltre" alt="Npm version"></a>
  <a href="https://codecov.io/gh/SocialGouv/archifiltre"><img src="https://codecov.io/gh/SocialGouv/archifiltre/branch/master/graph/badge.svg" alt="codecov"></a>
</p>

<br>

Archifiltre allows you to visualize and improve your file trees. Learn more about it [here](https://archifiltre.fabrique.social.gouv.fr/).

![Presentation](docs/presentation.png)

## 🚀 Launch the app

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

## 🔨 Building/releasing the app

First, prepare the build in production mode

```bash
yarn prepare-prod
```

### Preparation (code signing)

#### Windows

To sign the app manually and locally, you can use the command `yarn env-linux` or `yarn env-windows` depending on your platform.
Otherwise, running a GitHub pipeline through a pull request will automatically sign Archifiltre for Windows.

#### Mac

To build the app locally without signing, you can run `yarn mac-local`.
Otherwise, running a GitHub pipeline through a pull request will automatically sign Archifiltre for Mac.

Note: the file `electron/build/entitlments.mac.plist` contains the following flag: `com.apple.security.cs.allow-unsigned-executable-memory`. 
To notarize the app, this flag needs to be set to `true` to activate the "Hardened Runtime", a security mecanism by Apple.

#### Linux

There is no code signing on Linux, but every release has a SHA512 file corresponding to each binary. This can be used on a Linux system.

### Build the app

Then you can package the app for the right platform:

```bash
yarn win32
yarn win64
yarn mac
yarn linux
yarn win32-msi
yarn win64-msi
```

Or you can prepare the build and build for all four platforms with one command:

```bash
yarn build-prod
```

Once built, production binaries are found in the dist folder, each in their corresponding platform's subfolder.

## ✨ Contributing

To contribute, see more [here](https://github.com/SocialGouv/archifiltre/blob/master/CONTRIBUTING.md)

To know more about the project architecture, go [here](https://github.com/SocialGouv/archifiltre/blob/master/docs/README.md)

## 📝 Import script

Archifiltre provides you with an export script that you can run directly on your file server. To know more about it, go [here](https://github.com/SocialGouv/archifiltre/blob/master/scripts/README.md)
