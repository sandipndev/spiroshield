import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { CircularProgress, Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paperthis: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

function FileAccess(props) {
  const classes = useStyles();

  const [perms, setPerms] = useState([]);
  const [groupLookup, setGroupLookup] = useState({});
  const [fileLookup, setFileLookup] = useState({});
  const [permsLoaded, setPermsLoaded] = useState(false);
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = () => {
    props.Axios.post("/admin/list-groups")
      .then(({ data }) => {
        const lookupData = data.reduce((total, val) => {
          total[val["g_id"]] = val["g_name"];
          return total;
        }, {});
        setGroupLoaded(true);
        setGroupLookup(lookupData);
      })
      .catch(() => alert("Server Error"));

    props.Axios.post("/admin/all-pdfs")
      .then(({ data }) => {
        const lookupData = data.reduce((total, val) => {
          total[val["file_id"]] = val["file_name"];
          return total;
        }, {});
        setFileLoaded(true);
        setFileLookup(lookupData);
      })
      .catch(() => alert("Server Error"));

    props.Axios.post("/admin/all-permissions")
      .then(({ data }) => {
        setPermsLoaded(true);
        setPerms(data);
      })
      .catch(() => alert("Server Error"));
  };

  return (
    <div {...props}>
      {(!permsLoaded || !groupLoaded || !fileLoaded) && (
        <Paper className={classes.paperthis} elevation={0}>
          <CircularProgress size={25} color="secondary" />
          <div>Loading ...</div>
        </Paper>
      )}

      {permsLoaded && groupLoaded && fileLoaded && (
        <MaterialTable
          title=""
          data={perms}
          columns={[
            { title: "Group", field: "g_id", lookup: groupLookup },
            { title: "File Name", field: "file_id", lookup: fileLookup },
          ]}
          editable={{
            onRowAdd: (newData) => {
              return new Promise((resolve, _) => {
                const formData = new FormData();
                formData.append("g_id", newData.g_id);
                formData.append("file_id", newData.file_id);
                props.Axios.post("/admin/assign-file-to-group", formData)
                  .then(() => {
                    loadData();
                    resolve();
                  })
                  .catch(() => {
                    loadData();
                    resolve();
                  });
              });
            },

            onRowDelete: (oldData) => {
              return new Promise((resolve, _) => {
                const formData = new FormData();
                formData.append("g_id", oldData.g_id);
                formData.append("file_id", oldData.file_id);
                props.Axios.post("/admin/remove-file-from-group", formData)
                  .then(() => {
                    loadData();
                    resolve();
                  })
                  .catch(() => {
                    loadData();
                    resolve();
                  });
              });
            },
          }}
        />
      )}
    </div>
  );
}

export default FileAccess;
