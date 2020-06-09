import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Menubar from "./Menubar";
import {
  Grid,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Link,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import NewDiagnosis from "./NewDiagnosis";

const useStyles = makeStyles({
  table: {
    minWidth: "80vh",
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
  actionButton: {
    margin: "7px 0 0 0",
  },
  card: {
    width: 275,
    height: 150,
  },
  actions: {
    justifyContent: "flex-end",
  },
});

// function createData(diagnosisId, healthOfficer, status, dateSubmitted) {
//   return { diagnosisId, healthOfficer, status, dateSubmitted };
// }

// const rows = [
//   // createData("342341233124", "Steve Jobs", "Pending", "12/05/2020"),
//   // createData("342341233124", "Bill Gates", "Pending", "03/02/2020"),
//   // createData("342341233126", "Steve Balmer", "Result Ready", "14/03/2020"),
//   // createData("123323124423", "Steve Wozniak", "Submitted", "12/05/2020"),
// ];

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const isStaff = user.is_staff;

  const fetchDiagnoses = () => {
    const url = isStaff
      ? `http://127.0.0.1:8000/api/healthofficers/${user.id}/diagnoses/?status=AWAITING_REVIEW`
      : `http://127.0.0.1:8000/api/users/${user.id}/diagnoses/`;

    axios
      .get(url,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setDiagnoses(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(fetchDiagnoses, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const callback = (value) => {
    setOpen(false);
    fetchDiagnoses();
  };

  function formatDate(date) {
    let d = new Date(date);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return (
      d.getDate() +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      "  " +
      strTime
    );
  }

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
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  onClick={handleClickOpen}
                  className={classes.actionButton}
                >
                  New Diagnosis +
                </Button>
              }
              title={isStaff ? "Diagnoses Awaiting Review" : "Current Diagnoses"}
            />
            <NewDiagnosis open={open} parentCallback={callback} />
            <Divider />
            <CardContent>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Diagnosis ID</TableCell>
                    {!isStaff && (
                      <TableCell>Health Officer Assigned</TableCell>
                    )}
                    <TableCell>Status</TableCell>
                    <TableCell>Date Submitted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.diagnosisId}
                      </TableCell>
                      <TableCell align="left">{row.healthOfficer}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.dateSubmitted}</TableCell>
                    </TableRow>
                  ))} */}
                  {diagnoses.length == 0 && (
                    <TableRow>
                      <TableCell style={{textAlign: 'center'}} colSpan={isStaff ? 3 : 4}>{isStaff ? "No diagnoses to review" : "No submitted diagnoses"}</TableCell>
                    </TableRow>
                  )}
                  {diagnoses.map((diagnosis, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        <Link
                          component={RouterLink}
                          to={`/diagnosis/${diagnosis.id}`}
                        >
                          {diagnosis.id}
                        </Link>
                      </TableCell>
                      {!isStaff && (
                        <TableCell>
                          {diagnosis.health_officer.first_name}{" "}
                          {diagnosis.health_officer.last_name}
                        </TableCell>
                      )}
                      <TableCell>{diagnosis.status}</TableCell>
                      <TableCell>
                        {formatDate(diagnosis.creation_date)}
                      </TableCell>
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
