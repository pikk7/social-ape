import React, { useState, Fragment } from "react";
import clsx from "clsx";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Home from "../Home";
import About from "../About";
import Login from "../Login";
import Signup from "../Signup";
import Admin from "../Admin";
import PrivateRoute from "../PrivateRoute";
import Volunteer from "../Volunteer/Volunteer";

import { useAuth } from "../../context/auth";
//import { useJwt } from "react-jwt";

const drawerWidth = 240;
const history = createBrowserHistory();

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  toolbarMargin: theme.mixins.toolbar,
  aboveDrawer: {
    zIndex: theme.zIndex.drawer + 1,
  },
});

const MyToolbar = withStyles(styles)(({ classes, onMenuClick, logOut }) => (
  <Fragment>
    <AppBar className={classes.aboveDrawer}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <span style={{ flex: 1 }}></span>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aira-label="Logout"
          className={classes.menuButton}
          aria-haspopup="true"
          onClick={logOut}
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <div className={classes.toolbarMargin} />
  </Fragment>
));

const MyDrawer = withStyles(styles)(
  ({ classes, variant, open, onClose, onItemClick }) => (
    <Router history={history}>
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div
          className={clsx({
            [classes.toolbarMargin]: variant === "persistent",
          })}
        />
        <List>
          <ListItem button component={Link} to="/" onClick={onItemClick}>
            <ListItemText>Home</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/about" onClick={onItemClick}>
            <ListItemText>About</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/login" onClick={onItemClick}>
            <ListItemText>Login</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/signup" onClick={onItemClick}>
            <ListItemText>Signup</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/admin" onClick={onItemClick}>
            <ListItemText>Admin</ListItemText>
          </ListItem>

          <ListItem button component={Link} to="/profil" onClick={onItemClick}>
            <ListItemText>Profil</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/about" component={About} />
        <PrivateRoute path="/admin" component={Admin} />
        <PrivateRoute path="/profil" component={Volunteer} />
      </main>
    </Router>
  )
);

function AppBarInteraction({ classes, variant }) {
  const [drawer, setDrawer] = useState(false);
  const { setAuthTokens } = useAuth();
  // const token = useContext(AuthContext);
  // const { decodedToken, isExpired } = useJwt(token["authTokens"]);

  function logOut() {
    setAuthTokens();
  }

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  const onItemClick = () => {
    setDrawer(variant === "temporary" ? false : drawer);
    setDrawer(!drawer);
  };

  return (
    <div className={classes.root}>
      <MyToolbar onMenuClick={toggleDrawer} logOut={logOut} />
      <MyDrawer
        open={drawer}
        onClose={toggleDrawer}
        onItemClick={onItemClick}
        variant={variant}
      />
    </div>
  );
}

export default withStyles(styles)(AppBarInteraction);
