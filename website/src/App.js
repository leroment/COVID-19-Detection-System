import React from "react";
import "./App.css";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Dashboard from "./Screens/Dashboard";
import Diagnosis from "./Screens/Diagnosis";
import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Container disableGutters="true" maxWidth="none">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/diagnosis" component={Diagnosis} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
