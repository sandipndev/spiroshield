import React from "react";
import {
  CardContent,
  Card,
  Button,
  Typography,
  makeStyles,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  btn: {
    marginTop: theme.spacing(2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function UploadPDF(props) {
  const classes = useStyles();

  const [file, setFile] = useState(new File([], ""));
  const [fileChosen, setFileChosen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errHelp, setErrHelp] = useState({ error: false, helperMsg: "" });
  const [uploading, setUploading] = useState(false);
  const [doneMsg, setDoneMsg] = useState({
    done: false,
    success: false,
    message: "",
  });

  const upPDFFile = (event) => {
    if (event.target.files.length === 1) {
      setFileChosen(true);
      setFile(event.target.files[0]);
    }
  };

  const upload = () => {
    if (fileChosen && fileName !== "") {
      setErrHelp({ error: false, helperMsg: "" });
      setUploading(true);
      let formData = new FormData();
      formData.append("pdf-file", file);
      formData.append("file-name", fileName);
      props.Axios.post("/admin/pdf-upload", formData)
        .then(() => {
          setUploading(false);
          setFileChosen(false);
          setFileName("");
          setFile(new File([], ""));
          setDoneMsg({
            done: true,
            success: true,
            message: "Uploaded Successfully",
          });
        })
        .catch(({ response }) => {
          setUploading(false);
          setFileChosen(false);
          setFileName("");
          setFile(new File([], ""));

          var msg;
          switch (response.data) {
            case "PDF_100+":
              msg = "PDF has 100+ pages";
              break;
            case "PROCESSING":
              msg = "Previous File is getting processed";
              break;
            case "NOT_PDF":
              msg = "Uploaded file was not a PDF";
              break;
            default:
              msg = "Server Error occured";
          }
          setDoneMsg({
            done: true,
            success: false,
            message: msg,
          });
        });
    } else {
      setErrHelp({
        error: true,
        helperMsg: "The file as well as it's name - both are required!",
      });
    }
  };

  return (
    <Card {...props}>
      <CardContent>
        <Typography variant="h6">Add PDF File</Typography>
        <Typography>
          You can add a PDF File from this option. It takes some time to convert
          the PDF File on the server so please wait for some time to see the
          file reflect in other settings.
        </Typography>

        <TextField
          className={classes.btn}
          label="File Name"
          variant="outlined"
          type="text"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
          value={fileName}
          required={true}
          fullWidth={true}
          disabled={uploading}
          error={errHelp.error}
          helperText={errHelp.helperMsg}
        />

        <Button
          className={classes.btn}
          color="secondary"
          size="small"
          variant="outlined"
          component="label"
          disabled={uploading}
        >
          Choose File
          <input
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={upPDFFile}
          />
        </Button>
        <Typography>
          {fileChosen ? `Selected: ${file.name}` : "No File Chosen"}
        </Typography>
        <Button
          className={classes.btn}
          color="primary"
          size="medium"
          variant="contained"
          disabled={uploading}
          onClick={upload}
          endIcon={
            uploading && <CircularProgress color="secondary" size={20} />
          }
        >
          {uploading ? "Uploading" : "Upload"}
        </Button>

        {doneMsg.done && (
          <Alert
            className={classes.btn}
            severity={doneMsg.success ? "success" : "error"}
            onClose={() => {
              setDoneMsg({
                ...doneMsg,
                done: false,
              });
            }}
          >
            {doneMsg.message}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default UploadPDF;
