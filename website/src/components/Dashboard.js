import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Menubar from "./Menubar";
import {
  Grid,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Button,
  Divider,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Tooltip,
  TableSortLabel,
  Hidden,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const useStyles = makeStyles({
  table: {
    minWidth: "100vh",
  },
  root: {
    backgroundColor: grey[200],
    height: "100vh",
    width: "100%",
    padding: 0,
    margin: 0,
  },
  grid: {
    marginTop: "10vh",
  },
  button: {
    margin: "0px 0px 10px 82%",
  },
  card: {
    width: 275,
    height: 150,
  },
  actions: {
    justifyContent: "flex-end",
  },
});

function createData(diagnosisId, healthOfficer, status, dateSubmitted) {
  return { diagnosisId, healthOfficer, status, dateSubmitted };
}

const rows = [
  createData("342341233124", "Steve Jobs", "Pending", "12/05/2020"),
  createData("342341233124", "Bill Gates", "Pending", "03/02/2020"),
  createData("342341233126", "Steve Balmer", "Result Ready", "14/03/2020"),
  createData("123323124423", "Steve Wozniak", "Submitted", "12/05/2020"),
];

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Menubar />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid
          className={classes.grid}
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <Card className={classes.card}>
              <CardContent></CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card}>
              <CardContent></CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card}>
              <CardContent></CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item></Grid>
        <Grid item lg={12}>
          <Card>
            <CardHeader
              action={
                <Button color="primary" size="small" variant="outlined">
                  New Diagnosis +
                </Button>
              }
              title="Current Diagnoses"
            />
            <Divider />
            <CardContent>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Diagnosis ID</TableCell>
                    <TableCell>Health Officer Assigned</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Submitted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.diagnosisId}
                      </TableCell>
                      <TableCell align="left">{row.healthOfficer}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.dateSubmitted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
