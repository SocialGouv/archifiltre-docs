import createMuiTheme, { Theme } from "@material-ui/core/styles/createMuiTheme";
import blue from "@material-ui/core/colors/blue";
import indigo from "@material-ui/core/colors/indigo";

export interface ThemedProps {
  theme: Theme;
}

const primaryColor = blue;
const secondaryColor = indigo;

const defaultTheme = createMuiTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
  },
  overrides: {
    MuiInput: {
      input: {
        fontFamily: "QuicksandBold",
        textTransform: "uppercase",
        fontSize: "0.75rem",
      },
    },
    MuiTypography: {
      h5: {
        fontFamily: "QuicksandBold",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
      },
      h6: {
        fontFamily: "QuicksandBold",
        textTransform: "uppercase",
        fontSize: "0.625rem",
      },
      body1: {
        fontFamily: "Quicksand",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
      },
      body2: {
        fontFamily: "Quicksand",
        fontSize: "0.625rem",
      },
    },
    MuiSelect: {
      root: {
        fontFamily: "Quicksand",
        fontSize: "0.875rem",
        lineHeight: "0.875rem",
      },
      select: {
        padding: `6px 16px 6px 8px`,
        maxWidth: 150,
        borderRadius: 5,
        border: `1px solid ${secondaryColor.A400}`,
        color: secondaryColor.A400,
        "&:focus": {
          borderRadius: 5,
        },
      },
      icon: {
        color: secondaryColor.A400,
      },
    },
  },
});

export default defaultTheme;
