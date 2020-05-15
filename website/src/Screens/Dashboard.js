import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Menubar from "../components/Menubar";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@material-ui/core";
import { Redirect, Link } from "react-router-dom";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: grey[200],
    height: "100vh",
  },
  grid: {
    padding: 30,
  },
  card: {
    // minWidth: 300,
    // minHeight: 300,
    padding: 30,
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Menubar />
      <Grid
        container
        // direction="column"
        // justify="center"
        // alignItems="center"
        spacing={2}
        className={classes.grid}
      >
        <Card className={classes.card}>
          <Button variant="contained" color="secondary" component={Link} to="/diagnosis">
            New Diagnosis
          </Button>
        </Card>
      </Grid>
    </div>
  );
}
