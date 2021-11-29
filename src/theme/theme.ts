import type { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { themeOptions as defaultThemeOptions } from "theme/default-theme";

const themeOptions: ThemeOptions = {
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

export const theme = createMuiTheme(themeOptions);
