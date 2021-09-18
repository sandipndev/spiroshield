import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  marginupdown: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function DeleteGroup(props) {
  const classes = useStyles();

  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState({
    show: false,
    type: "",
    msg: "",
  });
  const [showDelWarn, setShowDelWarn] = useState(false);
  const [delGroup, setDelGroup] = useState({ id: -1, name: "" });

  const listGroups = () => {
    setLoading(true);
    props.Axios.post("/admin/list-groups")
      .then(({ data }) => {
        setLoading(false);
        setAllGroups(data);
      })
      .catch(() => {
        setLoading(false);
        setAlertData({ show: true, type: "error", msg: "Server Error" });
      });
  };

  const deleteGrp = (id, grpnm) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("g_id", id);
    props.Axios.post("/admin/delete-group", formData)
      .then(() => {
        setLoading(false);
        setAlertData({
          show: true,
          type: "success",
          msg: `Group ${grpnm} deleted`,
        });
        listGroups();
      })
      .catch(() => {
        setLoading(false);
        setAlertData({ show: true, type: "error", msg: "Server Error" });
      });
  };

  const handleClose = () => {
    setShowDelWarn(false);
  };

  return (
    <>
      <Card {...props}>
        <CardContent>
          <Typography variant="h6">All Groups</Typography>
          <Typography>
            Please Note that deletion is permanent and irrevokable
          </Typography>

          {allGroups.length !== 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Group Name</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allGroups.map((value) => (
                  <TableRow key={value.g_id}>
                    <TableCell>{value.g_name}</TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setDelGroup({
                            id: value.g_id,
                            name: value.g_name,
                          });
                          setShowDelWarn(true);
                        }}
                        disabled={loading}
                        endIcon={
                          loading && (
                            <CircularProgress color="secondary" size={18} />
                          )
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Button
            className={classes.marginupdown}
            color="secondary"
            size="small"
            variant="outlined"
            onClick={listGroups}
            disabled={loading}
            endIcon={
              loading && <CircularProgress color="secondary" size={18} />
            }
          >
            Load All
          </Button>
          {alertData.show && (
            <Alert
              className={classes.marginupdown}
              onClose={() => {
                setAlertData({
                  ...alertData,
                  show: false,
                });
              }}
              severity={alertData.type}
            >
              {alertData.msg}
            </Alert>
          )}
        </CardContent>
      </Card>
      <Dialog open={showDelWarn} onClose={handleClose}>
        <DialogTitle>
          Are you sure you want to delete {delGroup.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deletion of a group is permanent. This will remove all permissions
            of all users under this group as well. This action is irrevokeable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteGrp(delGroup.id, delGroup.name);
              setShowDelWarn(false);
            }}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteGroup;
