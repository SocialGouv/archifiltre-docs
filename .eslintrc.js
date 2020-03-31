module.exports = {
  extends: ["@socialgouv/eslint-config-react"],
  rules: {
    "react/prop-types": "off",
    "jsx-a11y/mouse-events-have-key-events": "off",
    "no-console": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/interactive-supports-focus": "off",
    "jsx-a11y/no-static-element-interactions": "off",
  },
  settings: {
    "import/resolver": "webpack",
  },
  globals: {
    MODE: "readonly",
    STATIC_ASSETS_PATH: "readonly",
    AUTOLOAD: "readonly",
    FORCE_TRACKING: "readonly",
    ARCHIFILTRE_SITE_URL: "readonly",
    SENTRY_DSN: "readonly",
    SENTRY_MINIDUMP_URL: "readonly",
    REACT_DEV_TOOLS_PATH: "readonly",
  },
  plugins: ["lodash-fp"],
  overrides: [
    {
      files: ["src/**/*.test.js", "src/**/*.test.ts", "src/test/**/*.js"],
      env: {
        jest: true,
      },
    },
  ],
};
