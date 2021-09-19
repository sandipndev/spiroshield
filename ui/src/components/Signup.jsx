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
  IconButton,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Back from "@material-ui/icons/ArrowBack";
import MuiAlert from "@material-ui/lab/Alert";
import Axios from "axios";
import { useHistory } from "react-router";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

function Signup(props) {
  const classes = useStyles();
  const history = useHistory();

  const [createUserData, setCreateUserData] = useState({
    name: "",
    email: "",
    password: "",
    user_signup_key: "",
  });

  const [helpCreateUserData, setHelpCreateUserData] = useState({
    name: { error: false, helperMsg: "" },
    email: { error: false, helperMsg: "" },
    password: { error: false, helperMsg: "" },
    user_signup_key: { error: false, helperMsg: "" },
  });

  const [loading, setLoading] = useState(false);
  const [showDoneAlert, setShowDoneAlert] = useState({
    show: false,
    type: "",
    msg: "",
  });

  const nameIsValid = (name) => name.length > 0 && name.length <= 50;
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
      nameIsValid(createUserData.name) &&
      emailIsValid(createUserData.email) &&
      passwordIsValid(createUserData.password) &&
      nameIsValid(createUserData.user_signup_key)
    ) {
      const formData = new FormData();
      formData.append("name", createUserData.name);
      formData.append("password", createUserData.password);
      formData.append("email", createUserData.email);
      formData.append("user_signup_key", createUserData.user_signup_key);
      setLoading(true);
      Axios.post("/user/signup", formData)
        .then(() => {
          setLoading(false);
          setShowDoneAlert({
            show: true,
            type: "success",
            msg: "User Added Successfully",
          });
          setCreateUserData({
            name: "",
            email: "",
            password: "",
            user_signup_key: "",
          });
        })
        .catch(({ response }) => {
          setLoading(false);
          if (response.data === "KEY_ERR") {
            setHelpCreateUserData({
              ...helpCreateUserData,
              user_signup_key: { error: true, helperMsg: "Key Incorrect" },
            });
          } else if (response.data === "EMAIL_EXISTS") {
            setHelpCreateUserData({
              ...helpCreateUserData,
              email: {
                error: true,
                helperMsg: "An account with that email already exists",
              },
            });
          } else {
            setShowDoneAlert({
              show: true,
              type: "error",
              msg: "Server Error",
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
          <Typography variant="h6">Create Account</Typography>
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

      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Create User</Typography>

            <TextField
              label="Name"
              variant="outlined"
              type="text"
              className={classes.updownone}
              onChange={(e) => {
                setCreateUserData({
                  ...createUserData,
                  name: e.target.value,
                });

                if (!nameIsValid(e.target.value)) {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    name: {
                      error: true,
                      helperMsg:
                        "Name can't be blank and must be <= 50 characters",
                    },
                  });
                } else {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    name: { error: false, helperMsg: "" },
                  });
                }
              }}
              value={createUserData.name}
              helperText={helpCreateUserData.name.helperMsg}
              error={helpCreateUserData.name.error}
              required={true}
              fullWidth={true}
              disabled={loading}
            />

            <TextField
              label="Email"
              variant="outlined"
              type="email"
              className={classes.updownone}
              onChange={(e) => {
                setCreateUserData({
                  ...createUserData,
                  email: e.target.value,
                });

                if (emailIsValid(e.target.value)) {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    email: { error: false, helperMsg: "" },
                  });
                } else {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    email: {
                      error: true,
                      helperMsg: "That doesn't seem like a proper email",
                    },
                  });
                }
              }}
              value={createUserData.email}
              helperText={helpCreateUserData.email.helperMsg}
              error={helpCreateUserData.email.error}
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
                setCreateUserData({
                  ...createUserData,
                  password: e.target.value,
                });

                if (passwordIsValid(e.target.value)) {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    password: { error: false, helperMsg: "" },
                  });
                } else {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    password: {
                      error: true,
                      helperMsg:
                        "Password very weak. Must contain atleast two of these - Uppercase, Lowercase, Numbers",
                    },
                  });
                }
              }}
              value={createUserData.password}
              helperText={helpCreateUserData.password.helperMsg}
              error={helpCreateUserData.password.error}
              required={true}
              fullWidth={true}
              disabled={loading}
            />

            <TextField
              label="Signup Key"
              variant="outlined"
              type="text"
              className={classes.updownone}
              onChange={(e) => {
                setCreateUserData({
                  ...createUserData,
                  user_signup_key: e.target.value,
                });

                if (!nameIsValid(e.target.value)) {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    user_signup_key: {
                      error: true,
                      helperMsg: "Key can't be blank",
                    },
                  });
                } else {
                  setHelpCreateUserData({
                    ...helpCreateUserData,
                    user_signup_key: { error: false, helperMsg: "" },
                  });
                }
              }}
              value={createUserData.user_signup_key}
              helperText={helpCreateUserData.user_signup_key.helperMsg}
              error={helpCreateUserData.user_signup_key.error}
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
              {loading ? "Signing Up" : "Sign Up"}
            </Button>
            {showDoneAlert.show && (
              <Alert
                className={classes.updownone}
                severity={showDoneAlert.type}
                onClose={() => {
                  setShowDoneAlert({
                    ...showDoneAlert,
                    show: false,
                  });
                }}
              >
                {showDoneAlert.msg}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Signup;
