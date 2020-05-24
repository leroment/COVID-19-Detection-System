import React from "react";
import { Formik } from "formik";
import { Grid, TextField, Button } from "@material-ui/core";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from 'axios';

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

export default function Register2() {
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

        axios.post('http://127.0.0.1:8000/api/register/', {
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          password: values.password,
        }).then((response) => {
          console.log(response);
          // TODO redirect to login
        }).then((error) => {
          console.log(error);
          // TODO error message
          // formik.setError ??
          setSubmitting(false);
        });

        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   resetForm();
        // }, 500);
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
            <Grid item>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                Register
              </Button>
            </Grid>
            <Grid item>
              <Link to="/">Back to Login</Link>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
