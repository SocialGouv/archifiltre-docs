import { PRODUCT_CHANNEL } from "@common/config";
import { type Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";

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
      fontSize: "2rem",
    },
    logoChannel: {
      color: theme.palette.error.dark,
      display: PRODUCT_CHANNEL !== "stable" ? "block" : "none",
      float: "right",
    },
    searchInput: {
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: 5,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  }),
);
