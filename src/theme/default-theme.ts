import grey from "@material-ui/core/colors/grey";
import type {
    Theme,
    ThemeOptions,
} from "@material-ui/core/styles/createMuiTheme";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export interface ThemedProps {
    theme: Theme;
}

const darkBlue = {
    contrastText: "#fff",
    dark: "#202a54",
    light: "#576393",
    main: "#2E3D79",
};

const primaryColor = darkBlue;
const secondaryColor = grey;

export const themeOptions: ThemeOptions = {
    overrides: {
        MuiButton: {
            outlinedSecondary: {
                borderColor: secondaryColor.A400,
            },
        },
        MuiChip: {
            root: {
                margin: "2px",
            },
        },
        MuiInput: {
            input: {
                fontFamily: "QuicksandBold",
                fontSize: "0.75rem",
                paddingBottom: 0,
                paddingTop: 0,
            },
        },
        MuiInputAdornment: {
            root: {
                fontSize: "0.75rem",
            },
        },
        MuiSelect: {
            icon: {
                color: secondaryColor.A400,
            },
            root: {
                fontFamily: "Quicksand",
                fontSize: "0.875rem",
                lineHeight: "0.875rem",
            },
            select: {
                "&:focus": {
                    borderRadius: 5,
                },
                border: `1px solid ${secondaryColor.A400}`,
                borderRadius: 5,
                color: secondaryColor.A400,
                padding: `6px 16px 6px 8px`,
            },
        },
        MuiTypography: {
            body1: {
                fontFamily: "QuicksandBold",
                fontSize: "0.75rem",
                lineHeight: 4 / 3,
            },
            body2: {
                fontFamily: "QuicksandBold",
                fontSize: "0.625rem",
            },
            h3: {
                fontFamily: "Quicksand",
                fontSize: "1rem",
                lineHeight: "1.25rem",
                textTransform: "uppercase",
            },
            h4: {
                fontFamily: "Quicksand",
                fontSize: "1rem",
                lineHeight: "1.25rem",
            },
            h5: {
                fontFamily: "Quicksand",
                fontSize: "0.75rem",
                lineHeight: 4 / 3,
                textTransform: "uppercase",
            },
            h6: {
                fontFamily: "Quicksand",
                fontSize: "0.625rem",
                textTransform: "uppercase",
            },
            subtitle2: {
                fontFamily: "Quicksand",
                fontSize: "0.625rem",
            },
        },
    },
    palette: {
        primary: primaryColor,
        secondary: secondaryColor,
    },
};

const defaultTheme = createMuiTheme(themeOptions);

export default defaultTheme;
