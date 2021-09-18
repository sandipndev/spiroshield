import React from "react";
import { makeStyles } from "@material-ui/core";

import AllUsers from "./AllUsers";

const useStyles = makeStyles((theme) => ({
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Users(props) {
  const classes = useStyles();
  const Axios = props.Axios;
  return (
    <>
      <AllUsers className={classes.updownspace} Axios={Axios} />
    </>
  );
}

export default Users;
