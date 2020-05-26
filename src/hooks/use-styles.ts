import { createStyles, Theme } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(3),
      top: theme.spacing(2),
      color: theme.palette.grey[500],
    },
    dialogContent: {
      padding: theme.spacing(2),
    },
    allTagsDialogContent: {
      padding: 0,
    },
    headerButton: {
      height: "45px",
      width: "45px",
      minWidth: 0,
    },
    tab: {
      minWidth: 0,
      padding: theme.spacing(1),
    },
    largeIndicatorText: {
      fontSize: "3rem",
      fontFamily: "QuicksandBold",
    },
  })
);
