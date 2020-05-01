import React, { useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form>
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        spacing={2}
        style={{ minHeight: "100vh" }}
      >
        <h1>Register</h1>
        <Grid item>
          <TextField name="firstname" type="text" placeholder="First Name" />
        </Grid>
        <Grid item>
          <TextField name="lastname" type="text" placeholder="Last Name" />
        </Grid>
        <Grid item>
          <TextField
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </Grid>
        <Grid item>
          <Button
            // disabled={!validateForm()}
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </Grid>
        <Grid item>
          <Link to="/">Login</Link>
        </Grid>
      </Grid>
    </form>
  );
}

export default Register;
