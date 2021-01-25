# [3.2.0](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0) (2021-01-25)


### Bug Fixes

* add translations for loading screen error message ([#1152](https://github.com/SocialGouv/archifiltre/issues/1152)) ([fc2b412](https://github.com/SocialGouv/archifiltre/commit/fc2b412358b41244d45d89d68b79d28ae12f97ce))
* fix production bug caused by worker refactoring ([#1160](https://github.com/SocialGouv/archifiltre/issues/1160)) ([dec7842](https://github.com/SocialGouv/archifiltre/commit/dec784280167d4d59c154037ebbf8e75aa791b3a))
* remove javascript rejected promise error in console ([#1161](https://github.com/SocialGouv/archifiltre/issues/1161)) ([293d2b8](https://github.com/SocialGouv/archifiltre/commit/293d2b88e086c4518c21dc3afba25d8dda89792d))
* stream data between child and main process to prevent memory overload([#1157](https://github.com/SocialGouv/archifiltre/issues/1157)) ([b9e5512](https://github.com/SocialGouv/archifiltre/commit/b9e5512af055acb45660a3d70e46c7d390441dbf))
* **background-loading-info:** fix z-index ([#1139](https://github.com/SocialGouv/archifiltre/issues/1139)) ([b3ebbcd](https://github.com/SocialGouv/archifiltre/commit/b3ebbcd85fb6ab5d59f80b9e9458f17021f5bee3))
* **deps:** update all dependencies ([#1142](https://github.com/SocialGouv/archifiltre/issues/1142)) ([188b53d](https://github.com/SocialGouv/archifiltre/commit/188b53d90738e17a0b00cf42377f1ab45ae74c1b))
* **deps:** update all dependencies ([#1155](https://github.com/SocialGouv/archifiltre/issues/1155)) ([50da2cb](https://github.com/SocialGouv/archifiltre/commit/50da2cbadef49c0a2bf625cec0944cd520c8b9d4))
* **deps:** update all non-major dependencies ([#1145](https://github.com/SocialGouv/archifiltre/issues/1145)) ([5aaf0cc](https://github.com/SocialGouv/archifiltre/commit/5aaf0cccb3bd87d73d1383735ac193f426baae89))
* fix loading of older versions of the script file ([#1124](https://github.com/SocialGouv/archifiltre/issues/1124)) ([6c2c67b](https://github.com/SocialGouv/archifiltre/commit/6c2c67b6b2511885f47ff3852ad68aee18131619))
* fix scroll bars on loading screen ([#1128](https://github.com/SocialGouv/archifiltre/issues/1128)) ([e256f2f](https://github.com/SocialGouv/archifiltre/commit/e256f2f7e36f487f44b686ca5872fffedd3f31a2))
* **github:** unify behaviour of release channels ([003abbd](https://github.com/SocialGouv/archifiltre/commit/003abbd9467024b707e8892d11680712ab3c9b64))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **hashes:** add release hashes in pipeline ([#1156](https://github.com/SocialGouv/archifiltre/issues/1156)) ([a8c90ea](https://github.com/SocialGouv/archifiltre/commit/a8c90ea34449c60b4385515e321a683d2046cfe8)), closes [#1139](https://github.com/SocialGouv/archifiltre/issues/1139) [#1142](https://github.com/SocialGouv/archifiltre/issues/1142) [#1155](https://github.com/SocialGouv/archifiltre/issues/1155) [#1145](https://github.com/SocialGouv/archifiltre/issues/1145) [#1124](https://github.com/SocialGouv/archifiltre/issues/1124) [#1128](https://github.com/SocialGouv/archifiltre/issues/1128) [#1118](https://github.com/SocialGouv/archifiltre/issues/1118) [#1149](https://github.com/SocialGouv/archifiltre/issues/1149) [#1141](https://github.com/SocialGouv/archifiltre/issues/1141) [#1140](https://github.com/SocialGouv/archifiltre/issues/1140) [#1146](https://github.com/SocialGouv/archifiltre/issues/1146) [#1126](https://github.com/SocialGouv/archifiltre/issues/1126) [#1129](https://github.com/SocialGouv/archifiltre/issues/1129) [#1095](https://github.com/SocialGouv/archifiltre/issues/1095) [#1010](https://github.com/SocialGouv/archifiltre/issues/1010) [#1121](https://github.com/SocialGouv/archifiltre/issues/1121)
* **signing:** add code signing certificate for Windows ([#1154](https://github.com/SocialGouv/archifiltre/issues/1154)) ([45cb612](https://github.com/SocialGouv/archifiltre/commit/45cb6128824d696539b5d5707303d19e541333b9))
* improve file system loading error handling ([#1149](https://github.com/SocialGouv/archifiltre/issues/1149)) ([e07e2c4](https://github.com/SocialGouv/archifiltre/commit/e07e2c4f8c267141214a279fc1b55cce1700f80f))
* **dropzone:** add error notification when multiple folders are dropped ([#1141](https://github.com/SocialGouv/archifiltre/issues/1141)) ([8dfcd24](https://github.com/SocialGouv/archifiltre/commit/8dfcd2462fc3d15ba187bed21d9216469ea6e61a))
* **error-screen:** add reload button on error screen ([#1140](https://github.com/SocialGouv/archifiltre/issues/1140)) ([3961b76](https://github.com/SocialGouv/archifiltre/commit/3961b76a2f3c360869703f2f36f0ad76467cdb96))
* **start-screen:** add error message when invalid path loaded ([#1146](https://github.com/SocialGouv/archifiltre/issues/1146)) ([342fac0](https://github.com/SocialGouv/archifiltre/commit/342fac03cd9eb6395463b9bade9bf0f23b0e8952))
* allow to edit element date ([#1126](https://github.com/SocialGouv/archifiltre/issues/1126)) ([02d0939](https://github.com/SocialGouv/archifiltre/commit/02d0939c9ee1f6c4360f125fdabcef8a6ccf4b3d))
* allow to save and load updated dates ([#1129](https://github.com/SocialGouv/archifiltre/issues/1129)) ([8b856ba](https://github.com/SocialGouv/archifiltre/commit/8b856baad4fd69f4b4018bdd0a9a26a43796b7e1))
* **github:** allow manual build trigged on github ([#1120](https://github.com/SocialGouv/archifiltre/issues/1120)) ([792f3cf](https://github.com/SocialGouv/archifiltre/commit/792f3cfcded25a95687d97b40e7c3ceaa3f628cd)), closes [#1095](https://github.com/SocialGouv/archifiltre/issues/1095) [#1010](https://github.com/SocialGouv/archifiltre/issues/1010) [#1121](https://github.com/SocialGouv/archifiltre/issues/1121)

# [3.2.0](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0) (2021-01-22)


### Bug Fixes

* add translations for loading screen error message ([#1152](https://github.com/SocialGouv/archifiltre/issues/1152)) ([fc2b412](https://github.com/SocialGouv/archifiltre/commit/fc2b412358b41244d45d89d68b79d28ae12f97ce))
* fix production bug caused by worker refactoring ([#1160](https://github.com/SocialGouv/archifiltre/issues/1160)) ([dec7842](https://github.com/SocialGouv/archifiltre/commit/dec784280167d4d59c154037ebbf8e75aa791b3a))
* remove javascript rejected promise error in console ([#1161](https://github.com/SocialGouv/archifiltre/issues/1161)) ([293d2b8](https://github.com/SocialGouv/archifiltre/commit/293d2b88e086c4518c21dc3afba25d8dda89792d))
* stream data between child and main process to prevent memory overload([#1157](https://github.com/SocialGouv/archifiltre/issues/1157)) ([b9e5512](https://github.com/SocialGouv/archifiltre/commit/b9e5512af055acb45660a3d70e46c7d390441dbf))
* **background-loading-info:** fix z-index ([#1139](https://github.com/SocialGouv/archifiltre/issues/1139)) ([b3ebbcd](https://github.com/SocialGouv/archifiltre/commit/b3ebbcd85fb6ab5d59f80b9e9458f17021f5bee3))
* **deps:** update all dependencies ([#1142](https://github.com/SocialGouv/archifiltre/issues/1142)) ([188b53d](https://github.com/SocialGouv/archifiltre/commit/188b53d90738e17a0b00cf42377f1ab45ae74c1b))
* **deps:** update all dependencies ([#1155](https://github.com/SocialGouv/archifiltre/issues/1155)) ([50da2cb](https://github.com/SocialGouv/archifiltre/commit/50da2cbadef49c0a2bf625cec0944cd520c8b9d4))
* **deps:** update all non-major dependencies ([#1145](https://github.com/SocialGouv/archifiltre/issues/1145)) ([5aaf0cc](https://github.com/SocialGouv/archifiltre/commit/5aaf0cccb3bd87d73d1383735ac193f426baae89))
* fix loading of older versions of the script file ([#1124](https://github.com/SocialGouv/archifiltre/issues/1124)) ([6c2c67b](https://github.com/SocialGouv/archifiltre/commit/6c2c67b6b2511885f47ff3852ad68aee18131619))
* fix scroll bars on loading screen ([#1128](https://github.com/SocialGouv/archifiltre/issues/1128)) ([e256f2f](https://github.com/SocialGouv/archifiltre/commit/e256f2f7e36f487f44b686ca5872fffedd3f31a2))
* **github:** unify behaviour of release channels ([003abbd](https://github.com/SocialGouv/archifiltre/commit/003abbd9467024b707e8892d11680712ab3c9b64))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **hashes:** add release hashes in pipeline ([#1156](https://github.com/SocialGouv/archifiltre/issues/1156)) ([a8c90ea](https://github.com/SocialGouv/archifiltre/commit/a8c90ea34449c60b4385515e321a683d2046cfe8)), closes [#1139](https://github.com/SocialGouv/archifiltre/issues/1139) [#1142](https://github.com/SocialGouv/archifiltre/issues/1142) [#1155](https://github.com/SocialGouv/archifiltre/issues/1155) [#1145](https://github.com/SocialGouv/archifiltre/issues/1145) [#1124](https://github.com/SocialGouv/archifiltre/issues/1124) [#1128](https://github.com/SocialGouv/archifiltre/issues/1128) [#1118](https://github.com/SocialGouv/archifiltre/issues/1118) [#1149](https://github.com/SocialGouv/archifiltre/issues/1149) [#1141](https://github.com/SocialGouv/archifiltre/issues/1141) [#1140](https://github.com/SocialGouv/archifiltre/issues/1140) [#1146](https://github.com/SocialGouv/archifiltre/issues/1146) [#1126](https://github.com/SocialGouv/archifiltre/issues/1126) [#1129](https://github.com/SocialGouv/archifiltre/issues/1129) [#1095](https://github.com/SocialGouv/archifiltre/issues/1095) [#1010](https://github.com/SocialGouv/archifiltre/issues/1010) [#1121](https://github.com/SocialGouv/archifiltre/issues/1121)
* **signing:** add code signing certificate for Windows ([#1154](https://github.com/SocialGouv/archifiltre/issues/1154)) ([45cb612](https://github.com/SocialGouv/archifiltre/commit/45cb6128824d696539b5d5707303d19e541333b9))
* improve file system loading error handling ([#1149](https://github.com/SocialGouv/archifiltre/issues/1149)) ([e07e2c4](https://github.com/SocialGouv/archifiltre/commit/e07e2c4f8c267141214a279fc1b55cce1700f80f))
* **dropzone:** add error notification when multiple folders are dropped ([#1141](https://github.com/SocialGouv/archifiltre/issues/1141)) ([8dfcd24](https://github.com/SocialGouv/archifiltre/commit/8dfcd2462fc3d15ba187bed21d9216469ea6e61a))
* **error-screen:** add reload button on error screen ([#1140](https://github.com/SocialGouv/archifiltre/issues/1140)) ([3961b76](https://github.com/SocialGouv/archifiltre/commit/3961b76a2f3c360869703f2f36f0ad76467cdb96))
* **start-screen:** add error message when invalid path loaded ([#1146](https://github.com/SocialGouv/archifiltre/issues/1146)) ([342fac0](https://github.com/SocialGouv/archifiltre/commit/342fac03cd9eb6395463b9bade9bf0f23b0e8952))
* allow to edit element date ([#1126](https://github.com/SocialGouv/archifiltre/issues/1126)) ([02d0939](https://github.com/SocialGouv/archifiltre/commit/02d0939c9ee1f6c4360f125fdabcef8a6ccf4b3d))
* allow to save and load updated dates ([#1129](https://github.com/SocialGouv/archifiltre/issues/1129)) ([8b856ba](https://github.com/SocialGouv/archifiltre/commit/8b856baad4fd69f4b4018bdd0a9a26a43796b7e1))
* **github:** allow manual build trigged on github ([#1120](https://github.com/SocialGouv/archifiltre/issues/1120)) ([792f3cf](https://github.com/SocialGouv/archifiltre/commit/792f3cfcded25a95687d97b40e7c3ceaa3f628cd)), closes [#1095](https://github.com/SocialGouv/archifiltre/issues/1095) [#1010](https://github.com/SocialGouv/archifiltre/issues/1010) [#1121](https://github.com/SocialGouv/archifiltre/issues/1121)

# [3.2.0](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0) (2021-01-20)


### Bug Fixes

* **background-loading-info:** fix z-index ([#1139](https://github.com/SocialGouv/archifiltre/issues/1139)) ([b3ebbcd](https://github.com/SocialGouv/archifiltre/commit/b3ebbcd85fb6ab5d59f80b9e9458f17021f5bee3))
* **deps:** update all dependencies ([#1142](https://github.com/SocialGouv/archifiltre/issues/1142)) ([188b53d](https://github.com/SocialGouv/archifiltre/commit/188b53d90738e17a0b00cf42377f1ab45ae74c1b))
* **deps:** update all dependencies ([#1155](https://github.com/SocialGouv/archifiltre/issues/1155)) ([50da2cb](https://github.com/SocialGouv/archifiltre/commit/50da2cbadef49c0a2bf625cec0944cd520c8b9d4))
* **deps:** update all non-major dependencies ([#1145](https://github.com/SocialGouv/archifiltre/issues/1145)) ([5aaf0cc](https://github.com/SocialGouv/archifiltre/commit/5aaf0cccb3bd87d73d1383735ac193f426baae89))
* fix loading of older versions of the script file ([#1124](https://github.com/SocialGouv/archifiltre/issues/1124)) ([6c2c67b](https://github.com/SocialGouv/archifiltre/commit/6c2c67b6b2511885f47ff3852ad68aee18131619))
* fix scroll bars on loading screen ([#1128](https://github.com/SocialGouv/archifiltre/issues/1128)) ([e256f2f](https://github.com/SocialGouv/archifiltre/commit/e256f2f7e36f487f44b686ca5872fffedd3f31a2))
* **github:** unify behaviour of release channels ([003abbd](https://github.com/SocialGouv/archifiltre/commit/003abbd9467024b707e8892d11680712ab3c9b64))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **hashes:** add release hashes in pipeline ([a1816d5](https://github.com/SocialGouv/archifiltre/commit/a1816d5755873c0596a5b6038d4480fbd06212ec))
* improve file system loading error handling ([#1149](https://github.com/SocialGouv/archifiltre/issues/1149)) ([e07e2c4](https://github.com/SocialGouv/archifiltre/commit/e07e2c4f8c267141214a279fc1b55cce1700f80f))
* **dropzone:** add error notification when multiple folders are dropped ([#1141](https://github.com/SocialGouv/archifiltre/issues/1141)) ([8dfcd24](https://github.com/SocialGouv/archifiltre/commit/8dfcd2462fc3d15ba187bed21d9216469ea6e61a))
* **error-screen:** add reload button on error screen ([#1140](https://github.com/SocialGouv/archifiltre/issues/1140)) ([3961b76](https://github.com/SocialGouv/archifiltre/commit/3961b76a2f3c360869703f2f36f0ad76467cdb96))
* **start-screen:** add error message when invalid path loaded ([#1146](https://github.com/SocialGouv/archifiltre/issues/1146)) ([342fac0](https://github.com/SocialGouv/archifiltre/commit/342fac03cd9eb6395463b9bade9bf0f23b0e8952))
* allow to edit element date ([#1126](https://github.com/SocialGouv/archifiltre/issues/1126)) ([02d0939](https://github.com/SocialGouv/archifiltre/commit/02d0939c9ee1f6c4360f125fdabcef8a6ccf4b3d))
* allow to save and load updated dates ([#1129](https://github.com/SocialGouv/archifiltre/issues/1129)) ([8b856ba](https://github.com/SocialGouv/archifiltre/commit/8b856baad4fd69f4b4018bdd0a9a26a43796b7e1))
* **github:** allow manual build trigged on github ([#1120](https://github.com/SocialGouv/archifiltre/issues/1120)) ([792f3cf](https://github.com/SocialGouv/archifiltre/commit/792f3cfcded25a95687d97b40e7c3ceaa3f628cd)), closes [#1095](https://github.com/SocialGouv/archifiltre/issues/1095) [#1010](https://github.com/SocialGouv/archifiltre/issues/1010) [#1121](https://github.com/SocialGouv/archifiltre/issues/1121)

# [3.2.0](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0) (2020-11-17)


### Bug Fixes

* **github:** unify behaviour of release channels ([003abbd](https://github.com/SocialGouv/archifiltre/commit/003abbd9467024b707e8892d11680712ab3c9b64))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **github:** allow manual build trigged on github ([#1120](https://github.com/SocialGouv/archifiltre/issues/1120)) ([792f3cf](https://github.com/SocialGouv/archifiltre/commit/792f3cfcded25a95687d97b40e7c3ceaa3f628cd)), closes [#1095](https://github.com/SocialGouv/archifiltre/issues/1095) [#1010](https://github.com/SocialGouv/archifiltre/issues/1010) [#1121](https://github.com/SocialGouv/archifiltre/issues/1121)

# [3.2.0-beta.6](https://github.com/SocialGouv/archifiltre/compare/v3.2.0-beta.5...v3.2.0-beta.6) (2020-11-13)


### Bug Fixes

* **github:** hard code the version name for win32 builds (3) ([a137b6c](https://github.com/SocialGouv/archifiltre/commit/a137b6c493e6fe2f0630e14fd2a403fa175217a2))
* **github:** hard code the version name for win32 builds (4) ([dc49221](https://github.com/SocialGouv/archifiltre/commit/dc4922166d2bdb947bde98d1765b6203126f34ef))
* **github:** hard code the version name for win32 builds (5) ([840a73d](https://github.com/SocialGouv/archifiltre/commit/840a73ddc215b5153280f417716665c2c3ada8c4))
* **github:** windows does not have sed :( ([730f793](https://github.com/SocialGouv/archifiltre/commit/730f7938131d7b6fdefe0916cccefa4f75ee9e99))

# [3.2.0-beta.5](https://github.com/SocialGouv/archifiltre/compare/v3.2.0-beta.4...v3.2.0-beta.5) (2020-11-12)


### Bug Fixes

* **github:** hard code the version name for win32 builds (2) ([2bb9e11](https://github.com/SocialGouv/archifiltre/commit/2bb9e11f56694ea84ac9051b6d5100cb2852c22d))

# [3.2.0-beta.4](https://github.com/SocialGouv/archifiltre/compare/v3.2.0-beta.3...v3.2.0-beta.4) (2020-11-12)


### Bug Fixes

* **github:** add missing prebuild steps ([281a336](https://github.com/SocialGouv/archifiltre/commit/281a336c3004458663408f6c7bf285ea95ba362c))
* **github:** full process test ([dd188cd](https://github.com/SocialGouv/archifiltre/commit/dd188cdbd07f3b9542ee903e469098fcaff71532))
* **github:** hard code the version name for win32 builds ([88b47f2](https://github.com/SocialGouv/archifiltre/commit/88b47f2fbb60fe8b6a62ff573a1f875f6b6dab7b))
* **github:** recreate the dist folder from artifacts ([7c5ede0](https://github.com/SocialGouv/archifiltre/commit/7c5ede0e4aa36eed668a85e208db9524e73ac1f2))
* **github:** share the next version ([e217fc0](https://github.com/SocialGouv/archifiltre/commit/e217fc0ff6c6fcfc2488f010f6141a4defbc715d))

# [3.2.0-beta.4](https://github.com/SocialGouv/archifiltre/compare/v3.2.0-beta.3...v3.2.0-beta.4) (2020-11-12)


### Bug Fixes

* **github:** add missing prebuild steps ([281a336](https://github.com/SocialGouv/archifiltre/commit/281a336c3004458663408f6c7bf285ea95ba362c))
* **github:** full process test ([dd188cd](https://github.com/SocialGouv/archifiltre/commit/dd188cdbd07f3b9542ee903e469098fcaff71532))

# [3.2.0-beta.3](https://github.com/SocialGouv/archifiltre/compare/v3.2.0-beta.2...v3.2.0-beta.3) (2020-11-12)


### Bug Fixes

* **github:** ensure to be allow to push multiple assets ([0b9cc73](https://github.com/SocialGouv/archifiltre/commit/0b9cc73080d9f01f8ca904029299100d205d6dfc))

# [3.2.0-beta.2](https://github.com/SocialGouv/archifiltre/compare/v3.2.0-beta.1...v3.2.0-beta.2) (2020-11-12)


### Bug Fixes

* **github:** try building the next release (17) ([ca896a0](https://github.com/SocialGouv/archifiltre/commit/ca896a0e3e24ce68220e3909d1af6a59ac89cae6))

# [3.2.0-beta.1](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0-beta.1) (2020-11-12)


### Bug Fixes

* **github:** fast result with mocked files ([e9a9fe9](https://github.com/SocialGouv/archifiltre/commit/e9a9fe92b19c2bbc1b5f0f1c155031d2add6207c))
* **github:** fast result with mocked files (2) ([2854978](https://github.com/SocialGouv/archifiltre/commit/2854978ea5abeabd69f958de050719b3c068a133))
* **github:** fast result with mocked files (3) ([7929aa5](https://github.com/SocialGouv/archifiltre/commit/7929aa5549b072ccf5f0793c84f7d9c746125e9f))
* **github:** fast result with mocked files (4) ([f9d0032](https://github.com/SocialGouv/archifiltre/commit/f9d0032eb9874b70eaf8c06048deb2ea3e890a03))
* **github:** test publishing linux bin ([65c8d75](https://github.com/SocialGouv/archifiltre/commit/65c8d7510fdce219c514ae407a9eddb390acc3e1))
* **github:** try building the next release (10) ([e6933e8](https://github.com/SocialGouv/archifiltre/commit/e6933e830f46efab39d6b23fad861726d10dd34e))
* **github:** try building the next release (11) ([cab103f](https://github.com/SocialGouv/archifiltre/commit/cab103fe93d7cd2c9ba74d55b4eb0fe0a693767e))
* **github:** try building the next release (12) ([35484d3](https://github.com/SocialGouv/archifiltre/commit/35484d3a05b5afb2f0b9d1bbe52054e6700482e3))
* **github:** try building the next release (13) ([9c3879b](https://github.com/SocialGouv/archifiltre/commit/9c3879b72d0e6de6ad319a5696ba604a913876fe))
* **github:** try building the next release (14) ([520cab3](https://github.com/SocialGouv/archifiltre/commit/520cab34cb2ac34f59b5b0cedc998b3f2c4aec65))
* **github:** try building the next release (15) ([d19bd14](https://github.com/SocialGouv/archifiltre/commit/d19bd14a15095c7e619d0e15e2f64fc058fdf693))
* **github:** try building the next release (16) ([7264b12](https://github.com/SocialGouv/archifiltre/commit/7264b123d0f1adac02cd5f474195da3c813c15b4))
* **github:** try building the next release (2) ([dbb9171](https://github.com/SocialGouv/archifiltre/commit/dbb91718c8cbabc0c2c89a4d90fcfcb5886fbfeb))
* **github:** try building the next release (3) ([e119535](https://github.com/SocialGouv/archifiltre/commit/e119535b03c23a0ba2b5ac6b628907a70b56a66c))
* **github:** try building the next release (4) ([229e704](https://github.com/SocialGouv/archifiltre/commit/229e704d33a238dbfe62e3b36cc1dc97ef5f6f16))
* **github:** try building the next release (5) ([626cede](https://github.com/SocialGouv/archifiltre/commit/626cede82ccf6d78ecfb5a7ff618d2e77c4d4497))
* **github:** try building the next release (6) ([aef07c3](https://github.com/SocialGouv/archifiltre/commit/aef07c39c0023e2cd7f189c4f25bba7ec256df45))
* **github:** try building the next release (7) ([8bae35f](https://github.com/SocialGouv/archifiltre/commit/8bae35fd83eb0b2b2a6129f7e23928adb898a89c))
* **github:** try building the next release (8) ([a178938](https://github.com/SocialGouv/archifiltre/commit/a17893859ea7e528854795b61dc7f6c537fac02d))
* **github:** try building the next release (9) ([13c00e4](https://github.com/SocialGouv/archifiltre/commit/13c00e447a9ede1008342db320898b969b2e8e6d))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **github:** add workflow_dispatch ([6c92de4](https://github.com/SocialGouv/archifiltre/commit/6c92de4831eeda00d979592422464aaf352ae9fd))

# [3.2.0-beta.1](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0-beta.1) (2020-11-12)


### Bug Fixes

* **github:** fast result with mocked files ([e9a9fe9](https://github.com/SocialGouv/archifiltre/commit/e9a9fe92b19c2bbc1b5f0f1c155031d2add6207c))
* **github:** fast result with mocked files (2) ([2854978](https://github.com/SocialGouv/archifiltre/commit/2854978ea5abeabd69f958de050719b3c068a133))
* **github:** fast result with mocked files (3) ([7929aa5](https://github.com/SocialGouv/archifiltre/commit/7929aa5549b072ccf5f0793c84f7d9c746125e9f))
* **github:** test publishing linux bin ([65c8d75](https://github.com/SocialGouv/archifiltre/commit/65c8d7510fdce219c514ae407a9eddb390acc3e1))
* **github:** try building the next release (10) ([e6933e8](https://github.com/SocialGouv/archifiltre/commit/e6933e830f46efab39d6b23fad861726d10dd34e))
* **github:** try building the next release (11) ([cab103f](https://github.com/SocialGouv/archifiltre/commit/cab103fe93d7cd2c9ba74d55b4eb0fe0a693767e))
* **github:** try building the next release (12) ([35484d3](https://github.com/SocialGouv/archifiltre/commit/35484d3a05b5afb2f0b9d1bbe52054e6700482e3))
* **github:** try building the next release (13) ([9c3879b](https://github.com/SocialGouv/archifiltre/commit/9c3879b72d0e6de6ad319a5696ba604a913876fe))
* **github:** try building the next release (14) ([520cab3](https://github.com/SocialGouv/archifiltre/commit/520cab34cb2ac34f59b5b0cedc998b3f2c4aec65))
* **github:** try building the next release (15) ([d19bd14](https://github.com/SocialGouv/archifiltre/commit/d19bd14a15095c7e619d0e15e2f64fc058fdf693))
* **github:** try building the next release (2) ([dbb9171](https://github.com/SocialGouv/archifiltre/commit/dbb91718c8cbabc0c2c89a4d90fcfcb5886fbfeb))
* **github:** try building the next release (3) ([e119535](https://github.com/SocialGouv/archifiltre/commit/e119535b03c23a0ba2b5ac6b628907a70b56a66c))
* **github:** try building the next release (4) ([229e704](https://github.com/SocialGouv/archifiltre/commit/229e704d33a238dbfe62e3b36cc1dc97ef5f6f16))
* **github:** try building the next release (5) ([626cede](https://github.com/SocialGouv/archifiltre/commit/626cede82ccf6d78ecfb5a7ff618d2e77c4d4497))
* **github:** try building the next release (6) ([aef07c3](https://github.com/SocialGouv/archifiltre/commit/aef07c39c0023e2cd7f189c4f25bba7ec256df45))
* **github:** try building the next release (7) ([8bae35f](https://github.com/SocialGouv/archifiltre/commit/8bae35fd83eb0b2b2a6129f7e23928adb898a89c))
* **github:** try building the next release (8) ([a178938](https://github.com/SocialGouv/archifiltre/commit/a17893859ea7e528854795b61dc7f6c537fac02d))
* **github:** try building the next release (9) ([13c00e4](https://github.com/SocialGouv/archifiltre/commit/13c00e447a9ede1008342db320898b969b2e8e6d))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **github:** add workflow_dispatch ([6c92de4](https://github.com/SocialGouv/archifiltre/commit/6c92de4831eeda00d979592422464aaf352ae9fd))

# [3.2.0-beta.1](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0-beta.1) (2020-11-12)


### Bug Fixes

* **github:** fast result with mocked files ([e9a9fe9](https://github.com/SocialGouv/archifiltre/commit/e9a9fe92b19c2bbc1b5f0f1c155031d2add6207c))
* **github:** fast result with mocked files (2) ([2854978](https://github.com/SocialGouv/archifiltre/commit/2854978ea5abeabd69f958de050719b3c068a133))
* **github:** fast result with mocked files (3) ([7929aa5](https://github.com/SocialGouv/archifiltre/commit/7929aa5549b072ccf5f0793c84f7d9c746125e9f))
* **github:** test publishing linux bin ([65c8d75](https://github.com/SocialGouv/archifiltre/commit/65c8d7510fdce219c514ae407a9eddb390acc3e1))
* **github:** try building the next release (10) ([e6933e8](https://github.com/SocialGouv/archifiltre/commit/e6933e830f46efab39d6b23fad861726d10dd34e))
* **github:** try building the next release (11) ([cab103f](https://github.com/SocialGouv/archifiltre/commit/cab103fe93d7cd2c9ba74d55b4eb0fe0a693767e))
* **github:** try building the next release (12) ([35484d3](https://github.com/SocialGouv/archifiltre/commit/35484d3a05b5afb2f0b9d1bbe52054e6700482e3))
* **github:** try building the next release (2) ([dbb9171](https://github.com/SocialGouv/archifiltre/commit/dbb91718c8cbabc0c2c89a4d90fcfcb5886fbfeb))
* **github:** try building the next release (3) ([e119535](https://github.com/SocialGouv/archifiltre/commit/e119535b03c23a0ba2b5ac6b628907a70b56a66c))
* **github:** try building the next release (4) ([229e704](https://github.com/SocialGouv/archifiltre/commit/229e704d33a238dbfe62e3b36cc1dc97ef5f6f16))
* **github:** try building the next release (5) ([626cede](https://github.com/SocialGouv/archifiltre/commit/626cede82ccf6d78ecfb5a7ff618d2e77c4d4497))
* **github:** try building the next release (6) ([aef07c3](https://github.com/SocialGouv/archifiltre/commit/aef07c39c0023e2cd7f189c4f25bba7ec256df45))
* **github:** try building the next release (7) ([8bae35f](https://github.com/SocialGouv/archifiltre/commit/8bae35fd83eb0b2b2a6129f7e23928adb898a89c))
* **github:** try building the next release (8) ([a178938](https://github.com/SocialGouv/archifiltre/commit/a17893859ea7e528854795b61dc7f6c537fac02d))
* **github:** try building the next release (9) ([13c00e4](https://github.com/SocialGouv/archifiltre/commit/13c00e447a9ede1008342db320898b969b2e8e6d))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **github:** add workflow_dispatch ([6c92de4](https://github.com/SocialGouv/archifiltre/commit/6c92de4831eeda00d979592422464aaf352ae9fd))

# [3.2.0-beta.1](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0-beta.1) (2020-11-12)


### Bug Fixes

* **github:** fast result with mocked files ([e9a9fe9](https://github.com/SocialGouv/archifiltre/commit/e9a9fe92b19c2bbc1b5f0f1c155031d2add6207c))
* **github:** fast result with mocked files (2) ([2854978](https://github.com/SocialGouv/archifiltre/commit/2854978ea5abeabd69f958de050719b3c068a133))
* **github:** fast result with mocked files (3) ([7929aa5](https://github.com/SocialGouv/archifiltre/commit/7929aa5549b072ccf5f0793c84f7d9c746125e9f))
* **github:** test publishing linux bin ([65c8d75](https://github.com/SocialGouv/archifiltre/commit/65c8d7510fdce219c514ae407a9eddb390acc3e1))
* **github:** try building the next release (10) ([e6933e8](https://github.com/SocialGouv/archifiltre/commit/e6933e830f46efab39d6b23fad861726d10dd34e))
* **github:** try building the next release (11) ([cab103f](https://github.com/SocialGouv/archifiltre/commit/cab103fe93d7cd2c9ba74d55b4eb0fe0a693767e))
* **github:** try building the next release (2) ([dbb9171](https://github.com/SocialGouv/archifiltre/commit/dbb91718c8cbabc0c2c89a4d90fcfcb5886fbfeb))
* **github:** try building the next release (3) ([e119535](https://github.com/SocialGouv/archifiltre/commit/e119535b03c23a0ba2b5ac6b628907a70b56a66c))
* **github:** try building the next release (4) ([229e704](https://github.com/SocialGouv/archifiltre/commit/229e704d33a238dbfe62e3b36cc1dc97ef5f6f16))
* **github:** try building the next release (5) ([626cede](https://github.com/SocialGouv/archifiltre/commit/626cede82ccf6d78ecfb5a7ff618d2e77c4d4497))
* **github:** try building the next release (6) ([aef07c3](https://github.com/SocialGouv/archifiltre/commit/aef07c39c0023e2cd7f189c4f25bba7ec256df45))
* **github:** try building the next release (7) ([8bae35f](https://github.com/SocialGouv/archifiltre/commit/8bae35fd83eb0b2b2a6129f7e23928adb898a89c))
* **github:** try building the next release (8) ([a178938](https://github.com/SocialGouv/archifiltre/commit/a17893859ea7e528854795b61dc7f6c537fac02d))
* **github:** try building the next release (9) ([13c00e4](https://github.com/SocialGouv/archifiltre/commit/13c00e447a9ede1008342db320898b969b2e8e6d))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **github:** add workflow_dispatch ([6c92de4](https://github.com/SocialGouv/archifiltre/commit/6c92de4831eeda00d979592422464aaf352ae9fd))

# [3.2.0-beta.1](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0-beta.1) (2020-11-12)


### Bug Fixes

* **github:** fast result with mocked files ([e9a9fe9](https://github.com/SocialGouv/archifiltre/commit/e9a9fe92b19c2bbc1b5f0f1c155031d2add6207c))
* **github:** fast result with mocked files (2) ([2854978](https://github.com/SocialGouv/archifiltre/commit/2854978ea5abeabd69f958de050719b3c068a133))
* **github:** fast result with mocked files (3) ([7929aa5](https://github.com/SocialGouv/archifiltre/commit/7929aa5549b072ccf5f0793c84f7d9c746125e9f))
* **github:** test publishing linux bin ([65c8d75](https://github.com/SocialGouv/archifiltre/commit/65c8d7510fdce219c514ae407a9eddb390acc3e1))
* **github:** try building the next release (2) ([dbb9171](https://github.com/SocialGouv/archifiltre/commit/dbb91718c8cbabc0c2c89a4d90fcfcb5886fbfeb))
* **github:** try building the next release (3) ([e119535](https://github.com/SocialGouv/archifiltre/commit/e119535b03c23a0ba2b5ac6b628907a70b56a66c))
* **github:** try building the next release (4) ([229e704](https://github.com/SocialGouv/archifiltre/commit/229e704d33a238dbfe62e3b36cc1dc97ef5f6f16))
* **github:** try building the next release (5) ([626cede](https://github.com/SocialGouv/archifiltre/commit/626cede82ccf6d78ecfb5a7ff618d2e77c4d4497))
* **github:** try building the next release (6) ([aef07c3](https://github.com/SocialGouv/archifiltre/commit/aef07c39c0023e2cd7f189c4f25bba7ec256df45))
* **github:** try building the next release (7) ([8bae35f](https://github.com/SocialGouv/archifiltre/commit/8bae35fd83eb0b2b2a6129f7e23928adb898a89c))
* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **github:** add workflow_dispatch ([6c92de4](https://github.com/SocialGouv/archifiltre/commit/6c92de4831eeda00d979592422464aaf352ae9fd))

# [3.2.0-beta.1](https://github.com/SocialGouv/archifiltre/compare/v3.1.1...v3.2.0-beta.1) (2020-11-12)


### Bug Fixes

* run branch builds on pull requests ([#1118](https://github.com/SocialGouv/archifiltre/issues/1118)) ([1e0b306](https://github.com/SocialGouv/archifiltre/commit/1e0b3062bd3a79db0b59510d6914de5352b53860))


### Features

* **github:** add workflow_dispatch ([6c92de4](https://github.com/SocialGouv/archifiltre/commit/6c92de4831eeda00d979592422464aaf352ae9fd))
