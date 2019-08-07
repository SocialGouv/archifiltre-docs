module.exports = {
  extends: ["@socialgouv/eslint-config-react"],
  rules: {
    "react/prop-types": "off",
    "jsx-a11y/mouse-events-have-key-events": "off",
    "no-console": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/interactive-supports-focus": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/anchor-is-valid": "off"
  },
  settings: {
    "import/resolver": "webpack"
  },
  globals: {
    MODE: "readonly",
    STATIC_ASSETS_PATH: "readonly"
  },
  overrides: [
    {
      files: ["src/**/*.test.js", "src/**/*.test.ts", "src/test/**/*.js"],
      env: {
        jest: true
      }
    }
  ]
};
