import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  makeStyles,
  TextField,
  CircularProgress,
  AppBar,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Back from "@material-ui/icons/ArrowBack";
import Axios from "axios";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  updownone: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  toolbar: theme.mixins.toolbar,
  toolbarButtons: {
    marginLeft: "auto",
  },
}));

function Login(props) {
  const classes = useStyles();
  const history = useHistory();

  const [loginUserData, setLoginUserData] = useState({
    email: "",
    password: "",
  });

  const [helpLoginUserData, setLoginCreateUserData] = useState({
    email: { error: false, helperMsg: "" },
    password: { error: false, helperMsg: "" },
  });

  const [loading, setLoading] = useState(false);

  const emailIsValid = (email) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
      email
    ) && email.length <= 100;
  const passwordIsValid = (password) =>
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g.test(
      password
    );

  const submit = () => {
    if (
      emailIsValid(loginUserData.email) &&
      passwordIsValid(loginUserData.password)
    ) {
      const formData = new FormData();
      formData.append("email", loginUserData.email);
      formData.append("password", loginUserData.password);
      setLoading(true);
      Axios.post("/user/login", formData)
        .then(({ data }) => {
          setLoading(false);
          setLoginUserData({
            email: "",
            password: "",
          });
          localStorage.setItem("user-token", data);
          history.push("/user");
        })
        .catch(({ response }) => {
          setLoading(false);
          if (response.data === "USER_X") {
            setLoginCreateUserData({
              ...helpLoginUserData,
              email: {
                error: true,
                helperMsg: "This email isn't registered with us",
              },
            });
          } else if (response.data === "PWORD_X") {
            setLoginCreateUserData({
              ...helpLoginUserData,
              password: {
                error: true,
                helperMsg: "Password incorrect",
              },
            });
          }
        });
    }
  };

  const themeChange = () =>
    props.setType(props.type === "light" ? "dark" : "light");

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={history.goBack}>
            <Back />
          </IconButton>
          <Typography variant="h6">User Login</Typography>
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

      <Container style={{ marginTop: "20px" }} maxWidth="md">
        <Card>
          <CardContent>
            <Typography variant="h6">Login</Typography>

            <TextField
              label="Email"
              variant="outlined"
              type="email"
              className={classes.updownone}
              onChange={(e) => {
                setLoginUserData({
                  ...loginUserData,
                  email: e.target.value,
                });

                if (emailIsValid(e.target.value)) {
                  setLoginCreateUserData({
                    ...helpLoginUserData,
                    email: { error: false, helperMsg: "" },
                  });
                } else {
                  setLoginCreateUserData({
                    ...helpLoginUserData,
                    email: {
                      error: true,
                      helperMsg: "That doesn't seem like a proper email",
                    },
                  });
                }
              }}
              value={loginUserData.email}
              helperText={helpLoginUserData.email.helperMsg}
              error={helpLoginUserData.email.error}
              required={true}
              fullWidth={true}
              disabled={loading}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              className={classes.updownone}
              onChange={(e) => {
                setLoginUserData({
                  ...loginUserData,
                  password: e.target.value,
                });

                if (passwordIsValid(e.target.value)) {
                  setLoginCreateUserData({
                    ...helpLoginUserData,
                    password: { error: false, helperMsg: "" },
                  });
                } else {
                  setLoginCreateUserData({
                    ...helpLoginUserData,
                    password: {
                      error: true,
                      helperMsg: "Doesn't seem like a valid password yet",
                    },
                  });
                }
              }}
              value={loginUserData.password}
              helperText={helpLoginUserData.password.helperMsg}
              error={helpLoginUserData.password.error}
              required={true}
              fullWidth={true}
              disabled={loading}
            />

            <Button
              color="primary"
              variant="contained"
              size="medium"
              disabled={loading}
              onClick={submit}
              endIcon={
                loading && <CircularProgress color="secondary" size={20} />
              }
            >
              {loading ? "Logging You In" : "Login"}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Login;
