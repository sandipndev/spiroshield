import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginTop: theme.spacing(2),
    },
  },
  ctabtn: {
    marginTop: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  paperMain: {
    marginTop: theme.spacing(3),
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
}));

function AdminLogin(props) {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const bearerToken = localStorage.getItem("admin-token");
    if (bearerToken !== null) {
      Axios.post("/admin/verify", "", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
        .then(() => {
          /* 200 */
          history.push("/admin-profile");
        })
        .catch(() => {
          /* 400 */
          localStorage.removeItem("admin-token");
        });
    }
  }, [history]);

  const themeChange = () =>
    props.setType(props.type === "light" ? "dark" : "light");

  const [adminSignInData, setAdminSignInData] = useState({
    username: "",
    password: "",
    adminKey: "",
  });

  const [adminSignInDataErrors, setAdminSignInDataErrors] = useState({
    username: { error: false, helperMsg: "" },
    password: { error: false, helperMsg: "" },
    adminKey: { error: false, helperMsg: "" },
  });

  const [loading, setLoading] = useState(false);

  const validateUsername = () => {
    if (adminSignInData.username === "") {
      setAdminSignInDataErrors({
        ...adminSignInDataErrors,
        username: {
          error: true,
          helperMsg: "This is a required field.",
        },
      });
    } else {
      setAdminSignInDataErrors({
        ...adminSignInDataErrors,
        username: {
          error: false,
          helperMsg: "",
        },
      });
    }
  };

  const validatePassword = () => {
    if (adminSignInData.password === "") {
      setAdminSignInDataErrors({
        ...adminSignInDataErrors,
        password: {
          error: true,
          helperMsg: "This is a required field.",
        },
      });
    } else {
      setAdminSignInDataErrors({
        ...adminSignInDataErrors,
        password: {
          error: false,
          helperMsg: "",
        },
      });
    }
  };

  const validateAdminKey = () => {
    if (adminSignInData.adminKey === "") {
      setAdminSignInDataErrors({
        ...adminSignInDataErrors,
        adminKey: {
          error: true,
          helperMsg: "This is a required field.",
        },
      });
    } else {
      setAdminSignInDataErrors({
        ...adminSignInDataErrors,
        adminKey: {
          error: false,
          helperMsg: "",
        },
      });
    }
  };

  const validate = () => {
    if (
      adminSignInData.username !== "" &&
      adminSignInData.password !== "" &&
      adminSignInData.adminKey !== ""
    ) {
      return true;
    } else {
      validateUsername();
      validatePassword();
      validateAdminKey();
      return false;
    }
  };

  const submitForm = () => {
    if (validate()) {
      const formData = new FormData();
      formData.append("username", adminSignInData.username);
      formData.append("password", adminSignInData.password);
      formData.append("adminKey", adminSignInData.adminKey);
      setLoading(true);
      Axios.post("/admin/login", formData)
        .then((val) => {
          setLoading(false);
          localStorage.setItem("admin-token", val.data);
          history.push("/admin-profile");
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.status === 500) {
            alert("Server Error, please try again.");
            return;
          }

          switch (error.response.data) {
            case "KEY_ERR":
              setAdminSignInDataErrors({
                ...adminSignInDataErrors,
                adminKey: {
                  error: true,
                  helperMsg: "Key Incorrect",
                },
              });
              break;
            case "PWORD_ERR":
              setAdminSignInDataErrors({
                ...adminSignInDataErrors,
                password: {
                  error: true,
                  helperMsg: "Password Incorrect",
                },
              });
              break;
            case "UNAME_ERR":
              setAdminSignInDataErrors({
                ...adminSignInDataErrors,
                username: {
                  error: true,
                  helperMsg: "Username Incorrect",
                },
              });
              break;
            default:
          }
        });
    }
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">Admin Login</Typography>
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

      <Container maxWidth="md" className={classes.paperMain}>
        <Card variant="outlined">
          <CardContent className={classes.root}>
            <Typography>
              Only for the administrators of this website.
            </Typography>
            <TextField
              label="Username"
              variant="outlined"
              onChange={(e) => {
                setAdminSignInData({
                  ...adminSignInData,
                  username: e.target.value,
                });
              }}
              value={adminSignInData.username}
              onBlur={validateUsername}
              helperText={adminSignInDataErrors.username.helperMsg}
              error={adminSignInDataErrors.username.error}
              autoFocus={true}
              required={true}
              fullWidth={true}
              disabled={loading}
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              onChange={(e) => {
                setAdminSignInData({
                  ...adminSignInData,
                  password: e.target.value,
                });
              }}
              value={adminSignInData.password}
              onBlur={validatePassword}
              helperText={adminSignInDataErrors.password.helperMsg}
              error={adminSignInDataErrors.password.error}
              required={true}
              fullWidth={true}
              disabled={loading}
            />
            <TextField
              type="password"
              label="Admin Key"
              variant="outlined"
              onChange={(e) => {
                setAdminSignInData({
                  ...adminSignInData,
                  adminKey: e.target.value,
                });
              }}
              value={adminSignInData.adminKey}
              onBlur={validateAdminKey}
              helperText={adminSignInDataErrors.adminKey.helperMsg}
              error={adminSignInDataErrors.adminKey.error}
              required={true}
              fullWidth={true}
              disabled={loading}
            />
            <Button
              className={classes.ctabtn}
              color="primary"
              variant="contained"
              size="medium"
              onClick={submitForm}
              disabled={loading}
              endIcon={
                loading && <CircularProgress color="secondary" size={20} />
              }
            >
              {loading ? "Logging In" : "Login"}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default AdminLogin;
