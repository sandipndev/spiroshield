import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  makeStyles,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Paper,
  Grid,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";
import JSZip from "jszip";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  ctabtn: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  mainTypo: {
    marginBottom: theme.spacing(1),
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  toolbar: theme.mixins.toolbar,
  paperthis: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "center",
  },
  w_100: {
    width: "100%",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SeePDFs(props) {
  const classes = useStyles();
  const [allFiles, setAllFiles] = useState([]);
  const [showPDFDialog, setShowPDFDialog] = useState(false);
  const [currentPDFName, setCurrentPDFName] = useState("");
  const [loading, setLoading] = useState(false);
  const [completeArray, setCompleteArray] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [alertData, setAlertData] = useState({
    show: false,
    type: "",
    msg: "",
  });
  const [showDelWarn, setShowDelWarn] = useState(false);
  const [delFile, setDelFile] = useState({ id: -1, name: "" });

  const loadPDFs = () => {
    props.Axios.post("/admin/all-pdfs").then(({ data }) => {
      setAllFiles(data);
      setLoaded(true);
    });
  };

  useEffect(() => {
    loadPDFs();
  }, []);

  const closeDialog = () => {
    setShowPDFDialog(false);
    setCompleteArray([]);
  };

  const delPDF = (file_id, file_name) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file_id", file_id);
    props.Axios.post("/admin/delete-pdf", formData)
      .then(() => {
        setAlertData({
          show: true,
          type: "success",
          msg: `${file_name} successfully deleted`,
        });
        setLoading(false);
        loadPDFs();
      })
      .catch(() => {
        setLoading(false);
        setAlertData({
          show: true,
          type: "error",
          msg: "Server Error Occured",
        });
      });
  };

  const handleClose = () => {
    setShowDelWarn(false);
  };

  const openPDFfor = (file_id, file_name) => {
    setCurrentPDFName(file_name);
    setShowPDFDialog(true);
    setLoading(true);

    const formData = new FormData();
    formData.append("file_id", file_id);

    props.Axios.request({
      method: "POST",
      url: "/admin/see-pdf",
      data: formData,
      responseType: "arraybuffer",
      responseEncoding: "binary",
    }).then(({ data }) => {
      const zip = new JSZip();
      zip.loadAsync(data).then((contents) => {
        const len = Object.keys(contents.files).length / 12;
        var fullArray = new Array(len);
        for (let i = 0; i < len; i++) {
          fullArray[i] = new Array(12);
        }

        var promises = [];

        for (const filename of Object.keys(contents.files)) {
          promises.push(
            new Promise((resolve, reject) => {
              zip
                .file(filename)
                .async("base64")
                .then((val) => {
                  var pgNo = /(\d+)-(\d+).jpg/g.exec(filename)[1];
                  var colNo = /(\d+)-(\d+).jpg/g.exec(filename)[2];
                  resolve({ pgNo, colNo, val: "data:image/jpg;base64," + val });
                })
                .catch(() => reject());
            }),
          );
        }

        Promise.all(promises).then((rx) => {
          for (let i = 0; i < rx.length; i++) {
            fullArray[rx[i]["pgNo"]][rx[i]["colNo"]] = rx[i]["val"];
          }
          setCompleteArray(fullArray);
          setLoading(false);
        });
      });
    });
  };

  return (
    <>
      <Card {...props}>
        <CardContent>
          <Typography className={classes.mainTypo} variant="h6">
            See All PDFs
          </Typography>
          {loaded && allFiles.length === 0 && (
            <Typography>No files to display</Typography>
          )}
          {allFiles.length !== 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>PDF Name</TableCell>
                  <TableCell>Open PDF</TableCell>
                  <TableCell>Delete PDF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allFiles.map((value) => (
                  <TableRow key={value.file_id}>
                    <TableCell>{value.file_name}</TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          openPDFfor(value.file_id, value.file_name);
                        }}
                      >
                        Open
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setDelFile({
                            id: value.file_id,
                            name: value.file_name,
                          });
                          setShowDelWarn(true);
                        }}
                      >
                        Del
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button
            className={classes.ctabtn}
            color="secondary"
            size="small"
            variant="outlined"
            onClick={loadPDFs}
          >
            Load All
          </Button>
          {alertData.show && (
            <Alert
              className={classes.ctabtn}
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
      <Dialog
        fullScreen
        open={showPDFDialog}
        onClose={closeDialog}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog}>
              <CloseIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6">
              {currentPDFName}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar}></div>
        {loading && (
          <Paper className={classes.paperthis} elevation={0}>
            <CircularProgress size={25} color="secondary" />
            <div>Loading ...</div>
          </Paper>
        )}
        {completeArray.length !== 0 && (
          <Box displayPrint="none">
            <Grid container spacing={0}>
              {completeArray.map((value, i1) => (
                <Grid key={i1} container xs={12} spacing={0}>
                  {value.map((val, i2) => (
                    <Grid key={i2} xs={1} item>
                      <img src={val} className={classes.w_100} alt="" />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Dialog>
      <Dialog open={showDelWarn} onClose={handleClose}>
        <DialogTitle>
          Are you sure you want to delete {delFile.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deletion of a file is permanent. This will remove all permissions of
            any groups having access to this file as well. This action is
            irrevokeable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              delPDF(delFile.id, delFile.name);
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

export default SeePDFs;
