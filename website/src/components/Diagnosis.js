import React, { useState, useEffect, useRef } from "react";
import Menubar from "./Menubar";
import axios from "axios";
import {
  Breadcrumbs,
  Link,
  Typography,
  Card,
  CardContent,
  Grid,
  ButtonGroup,
  Button,
  Chip,
  Divider,
} from "@material-ui/core";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import Thermometer from "react-thermometer-component";
// import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const useStyles = makeStyles({
  root: {
    backgroundColor: grey[200],
    height: "100vh",
    width: "100%",
    padding: 0,
    margin: 0,
  },
  breadcrumbs: {
    height: "4vh",
    margin: "2vh",
  },
  card: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 25,
    height: "100%",
    width: "50vw",
  },
  box: {
    height: "40vh",
    width: "20vw",
  },
});

const ResultMessage = (props) => {
  const classes = useStyles();
  const { staff, result, status, actionCallback } = props;

  if (!result) {
    return null;
  }

  if (staff) {
    if (status === "AWAITING_REVIEW") {
      return (
        <>
          <Grid item>
            <h3>
              Automated analysis believes this patient{" "}
              {result.has_covid ? " has" : " does not have"} COVID-19, with{" "}
              {result.confidence}% confidence.
            </h3>
          </Grid>
          <Grid container direction="row" justify="center" spacing={1}>
            <Grid item>
              <Button
                color="primary"
                size="small"
                variant="outlined"
                onClick={() => actionCallback(true)}
                className={classes.actionButton}
              >
                Approve
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                size="small"
                variant="outlined"
                onClick={() => actionCallback(false)}
                className={classes.actionButton}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </>
      );
    } else if (status === "NEEDS_DATA") {
      return (
        <>
          <Grid item>
            <h3
              style={{
                border: "3px",
                borderStyle: "solid",
                borderColor: "#FF0000",
                padding: "1em",
              }}
            >
              You have rejected the diagnosis.
            </h3>
          </Grid>
          <Grid item>
            <h3>
              Automated analysis believes this patient{" "}
              {result.has_covid ? " has" : " does not have"} COVID-19, with{" "}
              {result.confidence}% confidence.
            </h3>
          </Grid>
        </>
      );
    } else {
      if (result.approved) {
        return (
          <>
            <Grid item>
              <h3
                style={{
                  border: "3px",
                  borderStyle: "solid",
                  borderColor: "green",
                  padding: "1em",
                }}
              >
                You have approved the diagnosis.
              </h3>
            </Grid>
            <Grid item>
              <h3>
                Automated analysis believes this patient{" "}
                {result.has_covid ? " has" : " does not have"} COVID-19, with{" "}
                {result.confidence}% confidence.
              </h3>
            </Grid>
          </>
        );
      }
    }
  }

  if (status === "NEEDS_DATA") {
    return (
      <Grid item>
        <h3
          style={{
            border: "3px",
            borderStyle: "solid",
            borderColor: "#FF0000",
            padding: "1em",
          }}
        >
          Unfortunately, this diagnosis has NOT BEEN APPROVED by the health
          officer. Please create a new diagnosis with valid data.
        </h3>
      </Grid>
    );
  } else if (status === "AWAITING_REVIEW") {
    return (
      <Grid item>
        <h3
          style={{
            border: "3px",
            borderStyle: "solid",
            borderColor: "purple",
            padding: "1em",
          }}
        >
          Your diagnosis is AWAITING REVIEW. Please wait for approval from the
          health officer assigned.
        </h3>
      </Grid>
    );
  } else {
    if (result.approved) {
      return (
        <>
          <Grid item>
            <h3
              style={{
                border: "3px",
                borderStyle: "solid",
                borderColor: "green",
                padding: "1em",
              }}
            >
              Your diagnosis is REVIEWED. The result of this diagnosis is that{" "}
              {staff ? "this patient" : "you"}{" "}
              {result.has_covid
                ? !staff
                  ? " HAS "
                  : " HAVE "
                : !staff
                ? " DO NOT have "
                : " DOES NOT have "}
              COVID-19.
            </h3>
          </Grid>
        </>
      );
    }
  }

  return null;
};

export default function Diagnosis(props) {
  const classes = useStyles();
  const { diagnosisId } = props.match.params;
  const [diagnosis, setDiagnosis] = useState({});
  const [xrayImage, setXrayImage] = useState("");
  const [audio, setAudio] = useState("");
  const [temp, setTemp] = useState(0);
  const [content, setContent] = useState(0);
  const [info, setInfo] = useState({});

  const [returnToDashboard, setReturnToDashboard] = useState(false);

  const isInitialMount = useRef(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const isStaff = user.is_staff;

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

  function getContent(content) {
    switch (content) {
      case 0:
        return (
          <img
            src={`data:image/png;base64,${xrayImage}`}
            alt="xray"
            height="100%"
            width="100%"
          />
        );
      case 1:
        return (
          <audio
            controls
            controlsList="nodownload"
            src={`http://127.0.0.1:8000/api/audios/${audio}`}
            style={{ marginTop: "15vh" }}
          ></audio>

          // <AudioPlayer src={`http://127.0.0.1:8000/api/audios/${audio}`} />
        );
      case 2:
        return (
          <div style={{}}>
            <Thermometer
              theme="light"
              value={temp}
              max="100"
              steps="2"
              format="°C"
              size="large"
              height="300"
            />
          </div>
        );
      default:
        return "Nothing!";
    }
  }

  const fetchDiagnosis = () => {
    const url = isStaff
      ? `http://127.0.0.1:8000/api/healthofficers/${user.id}/diagnoses/${diagnosisId}/`
      : `http://127.0.0.1:8000/api/users/${user.id}/diagnoses/${diagnosisId}/`;

    axios
      .get(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setDiagnosis(response.data);
        setInfo(response.data.health_officer);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchXray = () => {
    axios
      .get(`http://127.0.0.1:8000/api/xrays/${diagnosis.xrayimages[0].id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        responseType: "arraybuffer",
      })
      .then((response) => {
        let base64img = Buffer.from(response.data, "binary").toString("base64");
        setXrayImage(base64img);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAudio = () => {
    // axios
    //   .get(
    //     `http://127.0.0.1:8000/api/audios/${diagnosis.audiorecordings[0].id}/`,
    //     {
    //       headers: {
    //         Authorization: `Token ${localStorage.getItem("token")}`,
    //       },
    //       responseType: "arrayBuffer",
    //     }
    //   )
    //   .then((response) => {
    //     let base64wav = Buffer.from(response.data, "binary").toString("base64");
    //     setAudio(base64wav);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setAudio(diagnosis.audiorecordings[0].id);
  };

  const fetchTemp = () => {
    setTemp(diagnosis.temperaturereadings[0].reading);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchDiagnosis();
    } else {
      // Your useEffect code here to be run on update
      fetchXray();
      fetchAudio();
      fetchTemp();
    }
  });

  const approve = (isApproved) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/healthofficers/${user.id}/diagnoses/${diagnosisId}/`,
        {
          approved: isApproved,
          // "comment": prompt("Comment"),
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setReturnToDashboard(true);
      });
  };

  if (returnToDashboard) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className={classes.root}>
      <Menubar />
      <div className={classes.breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/dashboard">
            Dashboard
          </Link>
          <Typography color="textPrimary">Diagnosis {diagnosisId}</Typography>
        </Breadcrumbs>
      </div>
      <div align="center">
        <Card className={classes.card}>
          <CardContent>
            <Grid
              container
              direction="column"
              spacing={3}
              justify="space-around"
            >
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="h2">
                      Diagnosis ID: {diagnosis.id}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      color={
                        diagnosis.status === "REVIEWED"
                          ? "primary"
                          : "secondary"
                      }
                      label={`Status: ${diagnosis.status}`}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider />
              <Grid item>
                <Grid
                  container
                  direction="row"
                  spacing={1}
                  justify="space-around"
                >
                  <Grid item style={{ flexBasis: 1 }}>
                    <Grid
                      container
                      direction="column"
                      justify="flex-start"
                      spacing={1}
                    >
                      <ResultMessage
                        staff={isStaff}
                        result={diagnosis.result}
                        status={diagnosis.status}
                        actionCallback={approve}
                      />
                      <Grid item>
                        <Chip
                          label={`Last Status Update: ${formatDate(
                            diagnosis.last_update
                          )}`}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          label={`Date Submitted: ${formatDate(
                            diagnosis.creation_date
                          )}`}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          label={`Health Officer Assigned: ${info.first_name} ${info.last_name}`}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider orientation="vertical" flexItem />
                  <Grid item style={{ flexBasis: 1 }}>
                    <Grid container direction="column">
                      <div align="center">
                        <Grid item className={classes.box}>
                          {getContent(content)}
                        </Grid>
                      </div>

                      <Grid
                        item
                        style={{ marginTop: "2vh", marginBottom: "2vh" }}
                      >
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                        >
                          <Button
                            variant={content === 0 ? "contained" : "outlined"}
                            onClick={() => setContent(0)}
                          >
                            Xray Image
                          </Button>
                          <Button
                            variant={content === 1 ? "contained" : "outlined"}
                            onClick={() => setContent(1)}
                          >
                            Cough Sample
                          </Button>
                          <Button
                            variant={content === 2 ? "contained" : "outlined"}
                            onClick={() => setContent(2)}
                          >
                            Temperature Reading
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
