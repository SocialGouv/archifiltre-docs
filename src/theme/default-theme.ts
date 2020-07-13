import createMuiTheme, { Theme } from "@material-ui/core/styles/createMuiTheme";
import grey from "@material-ui/core/colors/grey";

export interface ThemedProps {
  theme: Theme;
}

const darkBlue = {
  light: "#576393",
  main: "#2E3D79",
  dark: "#202a54",
  contrastText: "#fff",
};

const primaryColor = darkBlue;
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
    MuiInputAdornment: {
      root: {
        fontSize: "0.75rem",
      },
    },
    MuiTypography: {
      h3: {
        fontFamily: "Quicksand",
        textTransform: "uppercase",
        fontSize: "1rem",
        lineHeight: "1.25rem",
      },
      h4: {
        fontFamily: "Quicksand",
        fontSize: "1rem",
        lineHeight: "1.25rem",
      },
      h5: {
        fontFamily: "Quicksand",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
      },
      h6: {
        fontFamily: "Quicksand",
        textTransform: "uppercase",
        fontSize: "0.625rem",
      },
      body1: {
        fontFamily: "QuicksandBold",
        fontSize: "0.75rem",
        lineHeight: 4 / 3,
      },
      body2: {
        fontFamily: "QuicksandBold",
        fontSize: "0.625rem",
      },
      subtitle2: {
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
    MuiChip: {
      root: {
        margin: "2px",
      },
    },
  },
});

export default defaultTheme;
