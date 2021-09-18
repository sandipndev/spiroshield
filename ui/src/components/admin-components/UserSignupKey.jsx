import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  usKey: {
    margin: theme.spacing(2),
  },
}));

function UserSignupKey(props) {
  const classes = useStyles();
  const [uSKey, setUSKey] = useState("");

  const showUSKey = () => {
    const formData = new FormData();
    formData.append("type", "see");
    props.Axios.post("/admin/user-signup-key", formData)
      .then((response) => {
        setUSKey(() => response.data);
      })
      .catch(() => {
        setUSKey(() => "Some Error Occured");
      });
  };

  const requestNewUSKey = () => {
    const formData = new FormData();
    formData.append("type", "change");
    props.Axios.post("/admin/user-signup-key", formData)
      .then((response) => {
        setUSKey(() => response.data);
      })
      .catch(() => {
        setUSKey(() => "Some Error Occured");
      });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">User Signup Key</Typography>
        <Typography className={classes.usKey} variant="h5">
          {uSKey}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          size="medium"
          onClick={() => {
            uSKey === "" ? showUSKey() : requestNewUSKey();
          }}
        >
          {uSKey === "" ? "Show Key" : "Change Key"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserSignupKey;
