import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { Button, TextField, Grid, Card } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Sky from "react-sky";
import covid from "../assets/covid.png";
import { grey } from "@material-ui/core/colors";

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

function Login() {
  const classes = useStyles();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Must enter an email address"),
    password: Yup.string().required("Password is required"),
  });
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  if (redirectToDashboard) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <Sky
        images={{
          /* FORMAT AS FOLLOWS */
          0: covid /* You can pass as many images as you want */,
        }}
        how={
          20
        } /* Pass the number of images Sky will render chosing randomly */
        time={40} /* time of animation */
        size={"px"} /* size of the rendered images */
        background={grey[300]} /* color of background */
      />
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          setTimeout(() => {
            console.log(values);
            resetForm();
            setSubmitting(false);
            setRedirectToDashboard(true);
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
            <Grid
              container
              justify="center"
              alignItems="center"
              direction="column"
              spacing={2}
              style={{ height: "100vh", width: "100%" }}
            >
              <h1 style={{ color: "black" }}>Welcome to COVID-19 Detection!</h1>
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
                  variant="filled"
                  error={touched.email && (errors.email ? true : false)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item>
                <TextField
                  disabled={isSubmitting}
                  type="password"
                  id="password"
                  variant="filled"
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
                <Link to="/register">Register</Link>
              </Grid>
              <Grid item>
                <Link to="/">Forgot Your Password?</Link>
              </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={isSubmitting}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
