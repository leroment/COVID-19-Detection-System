import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Formik } from "formik";
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Link,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import * as Yup from "yup";
import { Redirect, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { Alert } from "@material-ui/lab";
import Sky from "react-sky";
import covid from "../assets/covid.png";
import { green, grey } from "@material-ui/core/colors";

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

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(255, "Must be shorter than 255")
    .required("Must enter a first name"),
  lastName: Yup.string()
    .max(255, "Must be shorter than 255")
    .required("Must enter a last name"),
  email: Yup.string()
    .email("Must be a valid email address")
    .max(255, "Must be shorter than 255")
    .required("Must enter an email address"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Password confirm is required"),
});

export default function Register(props) {
  const classes = useStyles();

  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    response: "",
    severity: "",
  });
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (redirectToLogin) {
    return <Redirect to={{ pathname: "/", state: snackbarOpen }} />;
  }

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        axios
          .post("http://127.0.0.1:8000/api/register/", {
            email: values.email,
            first_name: values.firstName,
            last_name: values.lastName,
            password: values.password,
          })
          .then((response) => {
            console.log(response);

            setSnackbarOpen((prev) => ({
              ...prev,
              open: true,
              response:
                "Created a user successfully! Redirecting to login page please wait ...",
              severity: "success",
            }));
            // TODO redirect to login
            setTimeout(() => {
              setRedirectToLogin(true);
            }, 1000);
          })
          .catch((error) => {
            // TODO error message
            // formik.setError ??

            if (error.response.data.username[0]) {
              setSnackbarOpen((prev) => ({
                ...prev,
                open: true,
                response: error.response.data.username[0],
                severity: "error",
              }));
            }

            setSubmitting(false);
          });
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
            open={snackbarOpen.open}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarOpen.severity}
            >
              {snackbarOpen.response}
            </Alert>
          </Snackbar>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={2}
            style={{ minHeight: "100vh" }}
          >
            <h1>Register for an account!</h1>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                type="text"
                name="firstName"
                id="firstName"
                variant="outlined"
                placeholder="First Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                label="First Name"
                error={touched.firstName && (errors.firstName ? true : false)}
                helperText={touched.firstName && errors.firstName}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                type="text"
                name="lastName"
                id="lastName"
                variant="outlined"
                placeholder="Last Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                label="Last Name"
                error={touched.lastName && (errors.lastName ? true : false)}
                helperText={touched.lastName && errors.lastName}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                type="email"
                name="email"
                id="email"
                variant="outlined"
                placeholder="Email Address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                label="Email Address"
                error={touched.email && (errors.email ? true : false)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                type="password"
                name="password"
                id="password"
                variant="outlined"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                label="Password"
                value={values.password}
                error={touched.password && (errors.password ? true : false)}
                helperText={touched.password && errors.password}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                variant="outlined"
                placeholder="Confirm Password"
                onChange={handleChange}
                onBlur={handleBlur}
                label="Confirm Password"
                value={values.confirmPassword}
                error={
                  touched.confirmPassword &&
                  (errors.confirmPassword ? true : false)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
            </Grid>
            <Grid item className={classes.wrapper}>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                Register
              </Button>
              {isSubmitting && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/">
                Back to Login
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
