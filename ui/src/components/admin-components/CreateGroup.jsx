import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  makeStyles,
  Button,
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

function CreateGroup(props) {
  const classes = useStyles();

  const [groupName, setGroupName] = useState("");
  const [groupErrMsg, setGroupErrMsg] = useState({
    error: false,
    helperMsg: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState({
    show: false,
    type: "",
    msg: "",
  });

  const gNameIsValid = (gname) => gname.length > 0 && gname.length <= 50;

  const submit = () => {
    if (gNameIsValid(groupName)) {
      setLoading(true);
      const formData = new FormData();
      formData.append("g_name", groupName);
      props.Axios.post("/admin/create-group", formData)
        .then(() => {
          setLoading(false);
          setAlertData({
            show: true,
            type: "success",
            msg: "Group successfully created",
          });
          setGroupName("");
          setGroupErrMsg({ error: false, helperMsg: "" });
        })
        .catch(({ response }) => {
          var data = response.data;
          setLoading(false);
          switch (data) {
            case "GNAME_DUP":
              setGroupErrMsg({
                error: true,
                helperMsg: "Duplicate Group Names not allowed",
              });
              break;
            default:
              setAlertData({
                show: true,
                type: "error",
                msg: "Server Error",
              });
          }
        });
    }
  };

  return (
    <Card {...props}>
      <CardContent>
        <Typography variant="h6">Create Group</Typography>
        <TextField
          className={classes.marginupdown}
          label="Group Name"
          variant="outlined"
          type="text"
          onChange={(e) => {
            setGroupName(e.target.value);

            if (!gNameIsValid(e.target.value)) {
              setGroupErrMsg({
                error: true,
                helperMsg:
                  "Group Name is required and must be less than 50 characters",
              });
            } else {
              setGroupErrMsg({ error: false, helperMsg: "" });
            }
          }}
          value={groupName}
          helperText={groupErrMsg.helperMsg}
          error={groupErrMsg.error}
          required={true}
          fullWidth={true}
          disabled={loading}
        />
        <Button
          className={classes.marginupdown}
          color="primary"
          variant="contained"
          size="medium"
          onClick={submit}
          disabled={loading}
          endIcon={loading && <CircularProgress color="secondary" size={20} />}
        >
          Create
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
  );
}

export default CreateGroup;
