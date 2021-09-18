import React from "react";
import { makeStyles } from "@material-ui/core";

import ChangePassword from "./ChangePassword";
import UserSignupKey from "./UserSignupKey";

const useStyles = makeStyles((theme) => ({
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Settings(props) {
  const classes = useStyles();
  const Axios = props.Axios;
  return (
    <>
      <ChangePassword className={classes.updownspace} Axios={Axios} />
      <UserSignupKey className={classes.updownspace} Axios={Axios} />
    </>
  );
}

export default Settings;
