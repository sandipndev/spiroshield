import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline, Link } from "@material-ui/core";

import Main from "./components/Main";
import AdminLogin from "./components/AdminLogin";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import User from "./components/User";

import "./styles.css";

function App() {
  const [type, setType] = useState("light");

  const muiTheme = createMuiTheme({
    palette: {
      type,
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Switch>
            {/* Open Routes */}
            <Route path="/" exact render={(props) => <Main {...props} type={type} setType={setType} />}></Route>
            <Route path="/admin" exact render={(props) => <AdminLogin {...props} type={type} setType={setType} />}></Route>
            <Route path="/login" exact render={(props) => <Login {...props} type={type} setType={setType} />}></Route>
            <Route path="/signup" exact render={(props) => <Signup {...props} type={type} setType={setType} />}></Route>

            {/* Private Routes */}
            <Route path="/admin-profile" exact render={(props) => <Admin {...props} type={type} setType={setType} />}></Route>
            <Route path="/user" exact render={(props) => <User {...props} type={type} setType={setType} />}></Route>
        </Switch>
      </Router>
      <div className="footer-text">
          <span>
        &copy; Copyright 2021, Built with lots of 🍕 at{" "}
        <Link
          color="secondary"
          href="https://hophacks.com"
        >
          HopHacks '21
        </Link>
        .
        </span>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
