import { adaptV4Theme, createTheme, type DeprecatedThemeOptions } from "@mui/material/styles";

import { themeOptions as defaultThemeOptions } from "./default-theme";

const themeOptions: DeprecatedThemeOptions = {
  ...defaultThemeOptions,
  overrides: {
    ...defaultThemeOptions.overrides,

    MuiTypography: {
      ...defaultThemeOptions.overrides?.MuiTypography,
      body1: {
        fontFamily: "Quicksand",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
      },
      h5: {
        fontFamily: "QuicksandBold",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
        textTransform: "uppercase",
      },
    },
  },
};

export const theme = createTheme(adaptV4Theme(themeOptions));
