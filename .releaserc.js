/** @type {"normal" | "version"} */
const releaseMode = process.env.ARCHIFILTRE_RELEASE_MODE ?? "normal";
const binName = require("./package.json").name;

console.info("Release script ----- Branch", process.env.GITHUB_REF);
const isPreRealse = process.env.GITHUB_REF
    ? ["refs/heads/dev", "refs/heads/beta"].includes(process.env.GITHUB_REF)
    : true;

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
                    `bin/**/${binName}*.@(exe|dmg|AppImage|msi|zip)?(.sha512|blockmap)`,
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
    branches: [
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
    ],
    plugins,
};

module.exports = config;
