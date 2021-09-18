import React from "react";
import { makeStyles } from "@material-ui/core";

import CreateGroup from "./CreateGroup";
import DeleteGroup from "./DeleteGroup";

const useStyles = makeStyles((theme) => ({
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Group(props) {
  const classes = useStyles();
  const Axios = props.Axios;
  return (
    <>
      <CreateGroup className={classes.updownspace} Axios={Axios} />
      <DeleteGroup className={classes.updownspace} Axios={Axios} />
    </>
  );
}

export default Group;
