import React from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Diagnosis from "./components/Diagnosis";
import { Container } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const UnPrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() === true ? (
        <Redirect to="/dashboard" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

function App() {
  return (
    <Router>
      <Container disableGutters maxWidth={false}>
        <Switch>
          <UnPrivateRoute exact path="/" component={Login} />
          <UnPrivateRoute path="/register" component={Register} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/diagnosis/:diagnosisId" component={Diagnosis} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
