import React from "react";

import { Button, TextField, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

function Login() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Must enter an email address"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
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
            style={{ minHeight: "100vh" }}
          >
            <h1>Welcome to COVID-19 Detection!</h1>
            <Grid item>
              <TextField
                disabled={isSubmitting}
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                label="Email Address"
                variant="outlined"
                error={touched.email && errors.email}
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
                error={touched.password && errors.password}
                helperText={touched.password && errors.password}
                value={values.password}
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
              <Link to="/register">Register</Link>
            </Grid>
            <Grid item>
              <Link href="/">Forgot Your Password?</Link>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

export default Login;
