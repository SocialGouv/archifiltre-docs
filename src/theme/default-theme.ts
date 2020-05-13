import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const defaultTheme = createMuiTheme({
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
  },
});

export default defaultTheme;
