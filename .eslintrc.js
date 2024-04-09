const tsconfigPath = "./tsconfig.json";
const tsconfigRendererPath = "./src/renderer/tsconfig.json";
const tsconfigMainPath = "./src/main/tsconfig.json";
const tsconfigCommonPath = "./src/common/tsconfig.json";
const tsconfigScriptsPath = "./scripts/tsconfig.json";

const typescriptConfig = {
  extends: "plugin:@typescript-eslint/recommended",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: tsconfigPath,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "typescript-sort-keys",
    "unused-imports",
    "react",
    "react-hooks",
    "prettier",
    "simple-import-sort",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/sort-type-constituents": "warn",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      { accessibility: "explicit", overrides: { accessors: "no-public", constructors: "no-public" } },
    ],
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "no-console": ["error", { allow: ["warn", "error", "info", "debug"] }],
    "prefer-template": "warn",
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { args: "after-used", argsIgnorePattern: "^_", vars: "all", varsIgnorePattern: "^_" },
    ],
  },
};

const defaultConfig = {
  ignorePatterns: ["node_modules"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      ...typescriptConfig,
      parserOptions: {
        project: [tsconfigPath, tsconfigRendererPath, tsconfigMainPath, tsconfigCommonPath, tsconfigScriptsPath],
      },
    },
    {
      files: ["src/renderer/**/*.ts*", "src/common/**/*.ts*"],
      env: { browser: true, node: true },
    },
    {
      files: ["src/main/**/*.ts"],
      env: { browser: false, node: true },
    },
    {
      files: "src/**/*.ts*",
      globals: { __static: true },
    },
    {
      files: "**/*.js",
      env: { node: true, es6: true},
    },
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/newline-after-import": "error",
    "import/no-useless-path-segments": "warn",
    "import/no-absolute-path": "warn",
    "prettier/prettier": [
      "error",
      {
        tabWidth: 2,
        trailingComma: "all",
        printWidth: 120,
        singleQuote: false,
        parser: "typescript",
        arrowParens: "avoid",
      },
    ],
  },
  plugins: ["react", "react-hooks", "prettier", "simple-import-sort", "import"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  root: true,
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: [tsconfigPath, tsconfigRendererPath, tsconfigMainPath, tsconfigCommonPath, tsconfigScriptsPath],
      },
    },
  },
};

module.exports = defaultConfig;
