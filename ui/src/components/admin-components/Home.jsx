import React from "react";
import { makeStyles } from "@material-ui/core";

import UserSignupKey from "./UserSignupKey";
import ActiveUsers from "./ActiveUsers";

const useStyles = makeStyles((theme) => ({
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Home(props) {
  const classes = useStyles();
  const Axios = props.Axios;
  return (
    <>
      <UserSignupKey className={classes.updownspace} Axios={Axios} />
      <ActiveUsers className={classes.updownspace} Axios={Axios} />
    </>
  );
}

export default Home;
