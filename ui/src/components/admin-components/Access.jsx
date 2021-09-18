import React from "react";
import { makeStyles } from "@material-ui/core";

import FileAccess from "./FileAccess";

const useStyles = makeStyles((theme) => ({
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Access(props) {
  const classes = useStyles();
  const Axios = props.Axios;
  return (
    <>
      <FileAccess className={classes.updownspace} Axios={Axios} />
    </>
  );
}

export default Access;
