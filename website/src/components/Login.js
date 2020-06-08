import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green, grey } from "@material-ui/core/colors";
import {
  Button,
  TextField,
  Grid,
  Snackbar,
  Link,
  Backdrop,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Redirect, Link as RouterLink } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sky from "react-sky";
import covid from "../assets/covid.png";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function Login(props) {
  const classes = useStyles();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      // TODO does not match email validation of Django (two character TLD e.g "a@gmail.a")
      .email("Invalid email address")
      .required("Must enter an email address"),
    password: Yup.string().required("Password is required"),
  });
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (redirectToDashboard) {
    return <Redirect to="/dashboard" />;
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setTimeout(() => {
          axios
            .post("http://127.0.0.1:8000/api/login", {
              email: values.email,
              password: values.password,
            })
            .then((response) => {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("userId", response.data.user.id);
              localStorage.setItem("user", JSON.stringify(response.data.user));
              setRedirectToDashboard(true);
            })
            .catch((err) => {
              // TODO error messages
              // formik.setError ??

              if (err.response.status === 400) {
                setSnackbarOpen(true);
              }

              setSubmitting(false);
            });
        }, 500);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Sky
            images={{
              /* FORMAT AS FOLLOWS */
              0: covid,
            }}
            how={
              10
            } /* Pass the number of images Sky will render chosing randomly */
            time={40} /* time of animation */
            size={"64px"} /* size of the rendered images */
            background={grey[200]} /* color of background */
          />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="error">
              Invalid username/password! Please try again.
            </Alert>
          </Snackbar>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={2}
            style={{ height: "100vh", width: "100%" }}
          >
            <h1>Welcome to COVID-19 Detection!</h1>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                name="email"
                type="text"
                placeholder="Email Address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                label="Email Address"
                variant="outlined"
                error={touched.email && (errors.email ? true : false)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                type="password"
                id="password"
                variant="outlined"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                error={touched.password && (errors.password ? true : false)}
                helperText={touched.password && errors.password}
                value={values.password}
              />
            </Grid>
            <Grid item className={classes.wrapper}>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                Login
              </Button>
              {isSubmitting && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register">
                Register
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/">
                Forgot Your Password?
              </Link>
            </Grid>
          </Grid>
          <Backdrop className={classes.backdrop} open={isSubmitting}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </form>
      )}
    </Formik>
  );
}

export default Login;
