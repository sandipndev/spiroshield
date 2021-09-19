import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import SeePDFs from "./user-components/SeePDFs";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Container,
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import ExitToApp from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  toolbarButtons: {
    marginLeft: "auto",
  },
}));

function User(props) {
  const history = useHistory();
  const classes = useStyles();

  const [loading, setLoading] = useState(true);

  const themeChange = () =>
    props.setType(props.type === "light" ? "dark" : "light");

  const logout = () => {
    localStorage.removeItem("user-token");
    history.push("/login");
  };

  useEffect(() => {
    const bearerToken = localStorage.getItem("user-token");
    if (bearerToken !== null) {
      Axios.post("/user/verify", "", {
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
                localStorage.removeItem("user-token");
                history.push("/login");
              }
              return Promise.reject(error);
            }
          );
          setLoading(false);
        })
        .catch(() => {
          /* 400 */
          localStorage.removeItem("user-token");
          history.push("/login");
          setLoading(false);
        });
    } else {
      history.push("/login");
    }
  }, [history, setLoading]);

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Welcome!
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

      <div className={classes.toolbar} />

      <Container maxWidth="md">
        {!loading && <SeePDFs Axios={Axios} />}
      </Container>
    </>
  );
}

export default User;
