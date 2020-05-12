import React from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Container>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
