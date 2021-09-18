import React from "react";
import { makeStyles } from "@material-ui/core";

import UploadPDF from "./UploadPDF";
import SeePDFs from "./SeePDFs";

const useStyles = makeStyles((theme) => ({
  updownspace: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function PDFOptions(props) {
  const classes = useStyles();
  const Axios = props.Axios;
  return (
    <>
      <UploadPDF className={classes.updownspace} Axios={Axios} />
      <SeePDFs className={classes.updownspace} Axios={Axios} />
    </>
  );
}

export default PDFOptions;
