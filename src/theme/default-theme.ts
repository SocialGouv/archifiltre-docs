import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const defaultTheme = createMuiTheme({
  overrides: {
    MuiInput: {
      input: {
        fontFamily: "Quicksand",
        fontWeight: "bold",
      },
    },
  },
});

export default defaultTheme;
