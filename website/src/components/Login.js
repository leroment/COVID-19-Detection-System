import React, { useState } from "react";
import { Button, TextField, Grid, Link } from "@material-ui/core";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // function validateForm() {
  //   return email.length > 0 && password.length > 0;
  // }

  function handleSubmit(event) {
    event.preventDefault();

    if (email === "admin@admin.com" && password === "admin123") {
      console.log("Logged in Successfully!");
      setIsLoggedIn(true);
    }
  }

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
        <h1>Welcome to COVID-19 Detection!</h1>
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
          <Button
            onClick={handleSubmit}
            // disabled={!validateForm()}
            variant="contained"
            color="primary"
          >
            Login
          </Button>
        </Grid>
        <Grid item>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Register
          </Link>
        </Grid>
        <Grid item>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Forgot Your Password?
          </Link>
        </Grid>
      </Grid>
    </form>
  );
}

export default Login;
