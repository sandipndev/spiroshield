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
} from "@material-ui/core";
import JSZip from "jszip";
import CloseIcon from "@material-ui/icons/Close";

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

  const loadPDFs = () => {
    props.Axios.post("/user/all-pdfs").then(({ data }) => {
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

  const openPDFfor = (file_id, file_name) => {
    setCurrentPDFName(file_name);
    setShowPDFDialog(true);
    setLoading(true);

    const formData = new FormData();
    formData.append("file_id", file_id);

    props.Axios.request({
      method: "POST",
      url: "/user/see-pdf",
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
      <Card>
        <CardContent>
          <Typography className={classes.mainTypo} variant="h6">
            Available PDFs
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
    </>
  );
}

export default SeePDFs;
