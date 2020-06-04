import createMuiTheme, { Theme } from "@material-ui/core/styles/createMuiTheme";
import blue from "@material-ui/core/colors/blue";
import grey from "@material-ui/core/colors/grey";

export interface ThemedProps {
  theme: Theme;
}

const primaryColor = blue;
const secondaryColor = grey;

const defaultTheme = createMuiTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
  },
  overrides: {
    MuiInput: {
      input: {
        fontFamily: "QuicksandBold",
        fontSize: "0.75rem",
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiTypography: {
      h4: {
        fontFamily: "QuicksandBold",
        textTransform: "uppercase",
        fontSize: "1.25rem",
        lineHeight: "1.25rem",
      },
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
