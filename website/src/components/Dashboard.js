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
  ButtonGroup,
  Typography,
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
  grid2: {
    marginTop: "25vh",
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

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);
  const [content, setContent] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalDiagnoses, setTotalDiagnoses] = useState(0);
  const [totalReviewedDiagnoses, setTotalReviewedDiagnoses] = useState(0);
  const [totalInfected, setTotalInfected] = useState(0);
  const [secondsSincePositive, setSecondsSincePositive] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isStaff = user.is_staff;

  const fetchStats = () => {
    axios
      .get(`http://127.0.0.1:8000/api/stats/`)
      .then((response) => {
        console.log(response.data);
        setActiveUsers(response.data.active_users);
        setTotalDiagnoses(response.data.total_diagnoses);
        setTotalReviewedDiagnoses(response.data.total_reviewed_diagnoses);
        setTotalInfected(response.data.total_infected);
        setSecondsSincePositive(response.data.seconds_since_positive);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDiagnoses = (what = 0) => {
    const url = isStaff
      ? what === 0
        ? `http://127.0.0.1:8000/api/healthofficers/${user.id}/diagnoses/?status=AWAITING_REVIEW`
        : what === 1
        ? `http://127.0.0.1:8000/api/healthofficers/${user.id}/diagnoses/?status=REVIEWED`
        : `http://127.0.0.1:8000/api/healthofficers/${user.id}/diagnoses/?status=NEEDS_DATA`
      : `http://127.0.0.1:8000/api/users/${user.id}/diagnoses/`;

    axios
      .get(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setDiagnoses(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchDiagnoses();
    fetchStats();
  }, []);

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
        {isStaff ? (
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
                <CardContent>
                  <Typography component="h5" variant="h5" align="center">
                    Active Users
                    <p>{activeUsers}</p>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography component="h5" variant="h5" align="center">
                    Total Diagnoses
                    <p>{totalDiagnoses}</p>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography component="h5" variant="h5" align="center">
                    Total Reviewed Diagonses
                    <p>{totalReviewedDiagnoses}</p>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography component="h5" variant="h5" align="center">
                    Total Infected
                    <p>{totalInfected}</p>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography component="h5" variant="h5" align="center">
                    Seconds Since Positive
                    <p>{secondsSincePositive}</p>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid
            className={classes.grid2}
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          ></Grid>
        )}

        <Grid item></Grid>
        {isStaff ? (
          <Grid item>
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                variant={content === 0 ? "contained" : "outlined"}
                onClick={() => {
                  setContent(0);
                  fetchDiagnoses(0);
                }}
              >
                Diagnoses Awaiting Review
              </Button>
              <Button
                variant={content === 1 ? "contained" : "outlined"}
                onClick={() => {
                  setContent(1);
                  fetchDiagnoses(1);
                }}
              >
                Diagnoses Reviewed
              </Button>
              <Button
                variant={content === 2 ? "contained" : "outlined"}
                onClick={() => {
                  setContent(2);
                  fetchDiagnoses(2);
                }}
              >
                Diagnoses Rejected
              </Button>
            </ButtonGroup>
          </Grid>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        <Grid item lg={12}>
          <Card>
            <CardHeader
              action={
                !isStaff ? (
                  <Button
                    color="primary"
                    size="small"
                    variant="outlined"
                    onClick={handleClickOpen}
                    className={classes.actionButton}
                  >
                    New Diagnosis +
                  </Button>
                ) : (
                  <React.Fragment></React.Fragment>
                )
              }
              title={
                isStaff
                  ? content === 0
                    ? "Diagnoses Awaiting Review"
                    : content === 1
                    ? "Diagnoses Reviewed"
                    : "Diagnoses Rejected"
                  : "My Diagnoses"
              }
            />
            <NewDiagnosis open={open} parentCallback={callback} />
            <Divider />
            <CardContent>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Diagnosis ID</TableCell>
                    {!isStaff && <TableCell>Health Officer Assigned</TableCell>}
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
                  {diagnoses.length === 0 && (
                    <TableRow>
                      <TableCell
                        style={{ textAlign: "center" }}
                        colSpan={isStaff ? 3 : 4}
                      >
                        {isStaff
                          ? content === 0
                            ? "No diagnoses to review"
                            : content === 1
                            ? "No diagnoses reviewed"
                            : "No diagnoses rejected"
                          : "No submitted diagnoses"}
                      </TableCell>
                    </TableRow>
                  )}
                  {/* {getContent(content)} */}
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
