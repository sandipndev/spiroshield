import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Paper, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paperthis: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

function AllUsers(props) {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [groupLookup, setGroupLookup] = useState({});
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [groupLoaded, setGroupLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = () => {
    setUsersLoaded(false);

    props.Axios.post("/admin/list-groups")
      .then(({ data }) => {
        const lookupData = data.reduce(
          (total, val) => {
            total[val["g_id"]] = val["g_name"];
            return total;
          },
          { null: "No Group" },
        );
        setGroupLoaded(true);
        setGroupLookup(lookupData);
      })
      .catch(() => alert("Server Error"));

    props.Axios.post("/admin/all-users")
      .then(({ data }) => {
        setUsers(data);
        setUsersLoaded(true);
      })
      .catch(() => alert("Server Error"));
  };

  return (
    <div {...props}>
      {(!usersLoaded || !groupLoaded) && (
        <Paper className={classes.paperthis} elevation={0}>
          <CircularProgress size={25} color="secondary" />
          <div>Loading ...</div>
        </Paper>
      )}

      {usersLoaded && groupLoaded && (
        <MaterialTable
          title=""
          data={users}
          columns={[
            { title: "User Name", field: "u_name", editable: "never" },
            { title: "Group", field: "u_grpid", lookup: groupLookup },
            { title: "Email ID", field: "u_email", editable: "never" },
          ]}
          editable={{
            onRowUpdate: (newData, oldData) => {
              return new Promise((resolve, _) => {
                if (String(oldData.u_grpid) !== String(newData.u_grpid)) {
                  const formData = new FormData();
                  formData.append("g_id", newData.u_grpid);
                  formData.append("u_id", newData.u_id);
                  props.Axios.post("/admin/assign-group-to-user", formData)
                    .then(() => {
                      loadData();
                      resolve();
                    })
                    .catch(() => {
                      loadData();
                      resolve();
                    });
                } else {
                  resolve();
                }
              });
            },

            onRowDelete: (oldData) => {
              return new Promise((resolve, _) => {
                const formData = new FormData();
                formData.append("u_id", oldData.u_id);
                props.Axios.post("/admin/terminate-user", formData)
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

export default AllUsers;
