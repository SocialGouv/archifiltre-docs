import { createStyles, Theme } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    select: {
      maxWidth: 150,
      borderRadius: 5,
      border: "1px solid #ced4da",
      backgroundColor: "white",
    },
  })
);
