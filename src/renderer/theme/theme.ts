import type { ThemeOptions } from "@material-ui/core/styles/createTheme";
import createTheme from "@material-ui/core/styles/createTheme";

import { themeOptions as defaultThemeOptions } from "./default-theme";

const themeOptions: ThemeOptions = {
  ...defaultThemeOptions,
  overrides: {
    ...defaultThemeOptions.overrides,
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

export const theme = createMuiTheme(themeOptions);
