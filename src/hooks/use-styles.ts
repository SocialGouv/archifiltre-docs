import type { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    allTagsDialogContent: {
      padding: 0,
    },
    body2Box: {
      fontSize: "0.625rem",
    },
    closeButton: {
      color: theme.palette.grey[500],
      position: "absolute",
      right: theme.spacing(2),
      top: theme.spacing(1.5),
    },
    dialogContent: {
      padding: theme.spacing(2),
    },
    editableField: {
      fontFamily: "Quicksand",
      fontSize: "0.625rem",
    },
    headerButton: {
      height: "45px",
      minWidth: 0,
      width: "45px",
    },
    largeIndicatorText: {
      fontFamily: "QuicksandBold",
      fontSize: "3rem",
    },
    searchInput: {
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: 5,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  })
);
