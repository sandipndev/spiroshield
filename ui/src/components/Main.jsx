import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Container,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
} from "@material-ui/core";

import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  logoImg: {
    height: "60px",
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
}));

function Main(props) {
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const uToken = localStorage.getItem("user-token");
    if (uToken) {
      history.push("/user");
    }
  }, [history]);

  const themeChange = () =>
    props.setType(props.type === "light" ? "dark" : "light");

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">Spiroshield</Typography>
          <div className={classes.toolbarButtons}>
            <IconButton edge="end" onClick={themeChange} color="inherit">
              {props.type === "light" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <div className={classes.toolbar} />

      <Container style={{marginTop: "20px"}} maxWidth="md">
        <Card>
          <CardContent>
            <img className={classes.logoImg} src="/logo.png" alt="Logo" />

            <Typography className={classes.updownspace}>
              Hello, welcome to Spiroshield! This is a location where you can get PDFs
              shared by an administrator. Please Login/Signup to continue.
            </Typography>

            <div>
              <Button
                className={classes.updownspace}
                color="primary"
                variant="contained"
                size="medium"
                onClick={() => {
                  history.push("/login");
                }}
              >
                Login
              </Button>
            </div>
            <div>
              <Button
                className={classes.updownspace}
                color="primary"
                variant="outlined"
                size="medium"
                onClick={() => {
                  history.push("/signup");
                }}
              >
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Main;
