import {
  AppBar,
  Toolbar,
  Typography,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const CustomAppBar = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography
          variant="h6"
          className={classes.title}
          onClick={() => history.push("/beers")}
        >
          Beers
        </Typography>
        {window.isAdmin && (
          <Typography
            variant="h6"
            onClick={() => history.push("/admin/order")}
            className={classes.title}
          >
            Order Management
          </Typography>
        )}
        {window.isAdmin && (
          <Typography
            variant="h6"
            onClick={() => history.push("/admin/beers")}
            className={classes.title}
          >
            Beer Management
          </Typography>
        )}
        {window.isAdmin && (
          <Typography
            variant="h6"
            onClick={() => history.push("/admin/generate")}
            className={classes.title}
          >
            License Management
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default CustomAppBar;
