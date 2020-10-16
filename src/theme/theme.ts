import createMuiTheme, {
  ThemeOptions,
} from "@material-ui/core/styles/createMuiTheme";

import { themeOptions as defaultThemeOptions } from "theme/default-theme";

const themeOptions: ThemeOptions = {
  ...defaultThemeOptions,
  overrides: {
    ...defaultThemeOptions.overrides,
    MuiTypography: {
      ...defaultThemeOptions.overrides?.MuiTypography,
      h5: {
        fontFamily: "QuicksandBold",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
      },
      body1: {
        fontFamily: "Quicksand",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
      },
    },
  },
};

export const theme = createMuiTheme(themeOptions);
