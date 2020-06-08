import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Typography,
  Box,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import NewDiagnosis from "./NewDiagnosis";

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

  const newDiagnosisCreatedCallback = (value) => {
    setOpen(false);
    fetchDiagnoses();
  };

  const approve = (id, isApproved) => {
    axios.put(
      `http://127.0.0.1:8000/api/healthofficers/${user.id}/diagnoses/${id}/`,
      {
        "approved": isApproved,
        "comment": prompt("Comment"),
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    ).then(fetchDiagnoses);
  };

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
            <NewDiagnosis open={open} parentCallback={newDiagnosisCreatedCallback} />
            <Divider />
            <CardContent>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Diagnosis ID</TableCell>
                    <TableCell>Health Officer Assigned</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Submitted</TableCell>
                    {isStaff && (
                      <>
                        <TableCell>Result</TableCell>
                        <TableCell>Result Confidence</TableCell>
                        <TableCell/>
                        <TableCell/>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {diagnoses.map((diagnosis, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {diagnosis.id}
                      </TableCell>
                      <TableCell align="left">{`${diagnosis.health_officer.first_name} ${diagnosis.health_officer.last_name}`}</TableCell>
                      <TableCell align="left">{diagnosis.status}</TableCell>
                      <TableCell align="left">{new Date(diagnosis.creation_date).toLocaleString()}</TableCell>
                      { isStaff && (
                        <>
                          <TableCell align="left">
                            <Typography component="div">
                              <Box fontWeight="fontWeightBold">
                                {diagnosis.result.has_covid ? "Has COVID-19" : "Does not have COVID-19"}
                              </Box>
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {`${diagnosis.result.confidence * 100}%`}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              color="primary"
                              size="small"
                              variant="outlined"
                              onClick={() => approve(diagnosis.id, true)}
                              className={classes.actionButton}
                            >
                              Approve
                            </Button>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              color="secondary"
                              size="small"
                              variant="outlined"
                              onClick={() => approve(diagnosis.id, false)}
                              className={classes.actionButton}
                            >
                              Decline
                            </Button>
                          </TableCell>
                        </>
                      )}
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
