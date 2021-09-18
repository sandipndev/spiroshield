import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  SwipeableDrawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToApp from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import GroupIcon from "@material-ui/icons/Group";
import UserIcon from "@material-ui/icons/SupervisedUserCircle";
import SetingsIcon from "@material-ui/icons/Settings";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Axios from "axios";

/* Components */
import Home from "./admin-components/Home"; /* 0 */
import Access from "./admin-components/Access"; /* 1 */
import Group from "./admin-components/Group"; /* 2 */
import PDFOptions from "./admin-components/PDFOptions"; /* 3 */
import Settings from "./admin-components/Settings"; /* 4 */
import Users from "./admin-components/Users"; /* 5 */

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
}));

const MyWindow = ({ winSelect, Axios }) => {
  switch (winSelect) {
    case 0:
      return <Home Axios={Axios} />;
    case 1:
      return <Access Axios={Axios} />;
    case 2:
      return <Group Axios={Axios} />;
    case 3:
      return <PDFOptions Axios={Axios} />;
    case 4:
      return <Settings Axios={Axios} />;
    case 5:
      return <Users Axios={Axios} />;
    default:
  }
};

function Admin(props) {
  const history = useHistory();
  const classes = useStyles();

  const themeChange = () =>
    props.setType(props.type === "light" ? "dark" : "light");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [winSelect, setWinSelect] = useState(0);
  const [title, setTitle] = useState("Administrator");

  useEffect(() => {
    const bearerToken = localStorage.getItem("admin-token");
    if (bearerToken !== null) {
      Axios.post("/admin/verify", "", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
        .then(() => {
          /* All requests will have the bearer token from now */
          Axios.defaults.headers.common = {
            Authorization: `Bearer ${bearerToken}`,
          };

          Axios.interceptors.response.use(
            (response) => {
              return response;
            },
            (error) => {
              if (error.response.status === 401) {
                localStorage.removeItem("admin-token");
                history.push("/admin");
              }
              return Promise.reject(error);
            }
          );
        })
        .catch(() => {
          /* 400 */
          localStorage.removeItem("admin-token");
          history.push("/admin");
        });
    } else {
      history.push("/admin");
    }
  }, [history]);

  const logout = () => {
    localStorage.removeItem("admin-token");
    history.push("/admin");
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => {
              setDrawerOpen(!drawerOpen);
            }}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <div className={classes.toolbarButtons}>
            <IconButton edge="end" onClick={themeChange} color="inherit">
              {props.type === "light" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            <IconButton edge="end" onClick={logout} color="inherit">
              <ExitToApp />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              setWinSelect(0);
              setTitle("Home");
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setWinSelect(1);
              setTitle("Access");
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <BeachAccessIcon />
            </ListItemIcon>
            <ListItemText primary="Access" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setWinSelect(3);
              setTitle("Documents");
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <PictureAsPdfIcon />
            </ListItemIcon>
            <ListItemText primary="Documents" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setWinSelect(2);
              setTitle("Group");
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Group" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setWinSelect(5);
              setTitle("Users");
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <UserIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setWinSelect(4);
              setTitle("Settings");
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <SetingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </SwipeableDrawer>

      <div className={classes.toolbar} />

      <Container maxWidth="md">
        <MyWindow winSelect={winSelect} Axios={Axios} />
      </Container>
    </>
  );
}

export default Admin;
