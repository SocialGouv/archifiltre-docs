/** @type {"normal" | "version"} */
const releaseMode = process.env.ARCHIFILTRE_RELEASE_MODE ?? "normal";
const binName = require("./package.json").name;

console.info("Release script ----- Branch", {
  originalRef: process.env.GITHUB_REF,
  override: process.env.GITHUB_REF_OVERRIDE,
});
/** @type {import("semantic-release").Options["branches"]} */
const branches = [
  "main",
  {
    channel: "next",
    name: "dev",
    prerelease: "next",
  },
  {
    name: "beta",
    prerelease: true,
  },
];
const isPreRealse = process.env.GITHUB_REF
  ? branches.some(
      (branche) =>
        branche.prerelease &&
        `refs/heads/${branche.name}` === process.env.GITHUB_REF
    )
  : true;

console.log({ isPreRealse });

/** @type {import("semantic-release").Options["plugins"]} */
const plugins = [
  "@semantic-release/commit-analyzer",
  [
    "@semantic-release/npm",
    {
      npmPublish: false,
    },
  ],
];

if (releaseMode === "normal") {
  plugins.push("@semantic-release/release-notes-generator");
  if (!isPreRealse) {
    plugins.push("@semantic-release/changelog", [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          "chore(${nextRelease.type}-release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}",
      },
    ]);
  }
  plugins.push(
    [
      "@semantic-release/github",
      {
        assets: [
          `bin/**/${binName}*.@(exe|dmg|AppImage|msi|zip)`,
          `bin/**/${binName}*.sha512`,
          `bin/**/${binName}*.blockmap`,
          "bin/**/latest*.yml",
        ],
        releasedLabels: false,
        successComment: false,
      },
    ],
    [
      "@semantic-release/exec",
      {
        publishCmd: `git notes --ref semantic-release add -f -m '{"channels": [\${nextRelease.channel ? JSON.stringify(nextRelease.channel) : null}]}' \${nextRelease.gitTag} && git push --force origin refs/notes/semantic-release`,
      },
    ]
  );
} else if (releaseMode === "version") {
  plugins.push([
    "@semantic-release/exec",
    {
      publishCmd:
        'echo "{\\"deleteLog\\": \\"$(/usr/bin/git tag -d ${nextRelease.gitTag} && /usr/bin/git push origin :${nextRelease.gitTag})\\"}"',
    },
  ]);
} else {
  throw new Error(
    `process.env.ARCHIFILTRE_RELEASE_MODE unknown (found=${process.env.ARCHIFILTRE_RELEASE_MODE})`
  );
}

/** @type {import("semantic-release").Options} */
const config = {
  branches,
  plugins,
};

module.exports = config;
