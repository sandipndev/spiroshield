import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginTop: theme.spacing(2),
    },
  },
  ctabtn: {
    marginTop: theme.spacing(3),
  },
}));

function ChangePassword(props) {
  const classes = useStyles();

  const [newPasswordData, setNewPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    retypeNewPassword: "",
  });

  const [newPasswordDataErrors, setNewPasswordDataErrors] = useState({
    oldPassword: { error: false, helperMsg: "" },
    newPassword: { error: false, helperMsg: "" },
    retypeNewPassword: { error: false, helperMsg: "" },
  });

  const [loading, setLoading] = useState(false);
  const [showDoneAlert, setShowDoneAlert] = useState(false);

  const submit = () => {
    if (
      newPasswordDataErrors.oldPassword.error === false &&
      newPasswordDataErrors.newPassword.error === false &&
      newPasswordDataErrors.retypeNewPassword.error === false
    ) {
      const formData = new FormData();
      formData.append("oldPassword", newPasswordData.oldPassword);
      formData.append("newPassword", newPasswordData.newPassword);
      formData.append("retypeNewPassword", newPasswordData.retypeNewPassword);
      setLoading(true);
      props.Axios.post("/admin/change-password", formData)
        .then(() => {
          setLoading(false);
          setNewPasswordData({
            oldPassword: "",
            newPassword: "",
            retypeNewPassword: "",
          });
          setNewPasswordDataErrors({
            oldPassword: { error: false, helperMsg: "" },
            newPassword: { error: false, helperMsg: "" },
            retypeNewPassword: { error: false, helperMsg: "" },
          });
          setShowDoneAlert(true);
        })
        .catch((error) => {
          setLoading(false);
          const field = error.response.data["field"];
          const msg = error.response.data["msg"];

          switch (field) {
            case "oldPassword":
              setNewPasswordDataErrors({
                ...newPasswordDataErrors,
                oldPassword: {
                  error: true,
                  helperMsg: msg,
                },
              });
              break;
            case "newPassword":
              setNewPasswordDataErrors({
                ...newPasswordDataErrors,
                newPassword: {
                  error: true,
                  helperMsg: msg,
                },
              });
              break;
            case "retypeNewPassword":
              setNewPasswordDataErrors({
                ...newPasswordDataErrors,
                retypeNewPassword: {
                  error: true,
                  helperMsg: msg,
                },
              });
              break;
            default:
              break;
          }
        });
    }
  };

  return (
    <Card variant="outlined" {...props}>
      <CardContent className={classes.root}>
        <Typography variant="h6">Change Password</Typography>
        <TextField
          label="Old Password"
          variant="outlined"
          type="password"
          onChange={(e) => {
            setNewPasswordData({
              ...newPasswordData,
              oldPassword: e.target.value,
            });
          }}
          value={newPasswordData.oldPassword}
          onBlur={() => {
            setNewPasswordDataErrors({
              ...newPasswordDataErrors,
              oldPassword: {
                error: false,
                helperMsg: "",
              },
            });
          }}
          helperText={newPasswordDataErrors.oldPassword.helperMsg}
          error={newPasswordDataErrors.oldPassword.error}
          required={true}
          fullWidth={true}
          disabled={loading}
        />
        <TextField
          label="New Password"
          variant="outlined"
          type="password"
          onChange={(e) => {
            setNewPasswordData({
              ...newPasswordData,
              newPassword: e.target.value,
            });

            var strongRegex = new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
            );

            if (!strongRegex.test(e.target.value)) {
              setNewPasswordDataErrors({
                ...newPasswordDataErrors,
                newPassword: {
                  error: true,
                  helperMsg:
                    "Admin Password must contain atleast 1 lowercase, 1 uppercase, 1 number and a special character",
                },
              });
            } else {
              setNewPasswordDataErrors({
                ...newPasswordDataErrors,
                newPassword: {
                  error: false,
                  helperMsg: "",
                },
              });
            }
          }}
          value={newPasswordData.newPassword}
          helperText={newPasswordDataErrors.newPassword.helperMsg}
          error={newPasswordDataErrors.newPassword.error}
          required={true}
          fullWidth={true}
          disabled={loading}
        />
        <TextField
          label="Retype New Password"
          variant="outlined"
          type="password"
          onChange={(e) => {
            setNewPasswordData({
              ...newPasswordData,
              retypeNewPassword: e.target.value,
            });

            if (newPasswordData.newPassword !== e.target.value) {
              setNewPasswordDataErrors({
                ...newPasswordDataErrors,
                retypeNewPassword: {
                  error: true,
                  helperMsg: "Passwords don't match",
                },
              });
            } else {
              setNewPasswordDataErrors({
                ...newPasswordDataErrors,
                retypeNewPassword: {
                  error: false,
                  helperMsg: "",
                },
              });
            }
          }}
          value={newPasswordData.retypeNewPassword}
          helperText={newPasswordDataErrors.retypeNewPassword.helperMsg}
          error={newPasswordDataErrors.retypeNewPassword.error}
          required={true}
          fullWidth={true}
          disabled={loading}
        />
        <Button
          className={classes.ctabtn}
          color="primary"
          variant="contained"
          size="medium"
          onClick={submit}
          disabled={loading}
          endIcon={loading && <CircularProgress color="secondary" size={20} />}
        >
          {loading ? "Updating" : "Update"}
        </Button>
        {showDoneAlert && (
          <Alert
            className={classes.ctabtn}
            severity="success"
            onClose={() => {
              setShowDoneAlert(false);
            }}
          >
            Password Changed Successfully
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default ChangePassword;
