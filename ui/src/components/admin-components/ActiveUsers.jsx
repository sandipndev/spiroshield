import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  makeStyles,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  ctabtn: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function ActiveUsers(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    props.Axios.post("/admin/active-users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data);
        setLoaded(true);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
        setError(true);
      });
  };

  return (
    <Card {...props}>
      <CardContent>
        <Typography variant="h6">Active Users</Typography>
        <Typography className={classes.ctabtn}>
          Users with activity in last 20 minutes
        </Typography>

        {users.length !== 0 && (
          <List className={classes.ctabtn} dense={true}>
            {users.map((value, index) => (
              <ListItem key={index}>
                <ListItemText>{value.u_name}</ListItemText>
              </ListItem>
            ))}
          </List>
        )}

        {loaded && users.length === 0 && (
          <Typography>Oops, nobody seems to be active recently.</Typography>
        )}

        <Button
          className={classes.ctabtn}
          color="primary"
          variant="contained"
          size="medium"
          onClick={loadUsers}
          disabled={loading}
          endIcon={loading && <CircularProgress color="secondary" size={20} />}
        >
          {loading ? "Loading" : "Refresh Users"}
        </Button>

        {error && (
          <Alert
            className={classes.ctabtn}
            severity="error"
            onClose={() => {
              setError(false);
            }}
          >
            Server Error Occured
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default ActiveUsers;
