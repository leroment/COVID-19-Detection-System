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
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import Thermometer from "react-thermometer-component";

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
    height: "70vh",
    width: "30vw",
  },
  box: {
    height: "60vh",
  },
});

export default function Diagnosis(props) {
  const classes = useStyles();
  const { diagnosisId } = props.match.params;
  const [diagnosis, setDiagnosis] = useState({});
  const [xrayImage, setXrayImage] = useState("");
  const [audio, setAudio] = useState("");
  const [temp, setTemp] = useState(0);
  const [content, setContent] = useState(0);
  const [info, setInfo] = useState({});

  const isInitialMount = useRef(true);

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
            style={{ marginTop: "25vh" }}
          ></audio>
        );
      case 2:
        return (
          <div style={{ marginTop: "10vh" }}>
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
    axios
      .get(
        `http://127.0.0.1:8000/api/users/${localStorage.getItem(
          "userId"
        )}/diagnoses/${diagnosisId}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
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
      <div>
        <Grid container direction="row" justify="center">
          <Grid item>
            <Card className={classes.card}>
              <CardContent>
                <Grid container direction="column" align="center">
                  <Grid item className={classes.box}>
                    {getContent(content)}
                  </Grid>
                  <Grid item style={{ marginTop: "2vh", marginBottom: "2vh" }}>
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card}>
              <CardContent>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  align="center"
                >
                  <Grid item>
                    <h1>Diagnosis ID: {diagnosis.id}</h1>
                    <p>Status: {diagnosis.status}</p>
                    <p>
                      Last Status Update: {formatDate(diagnosis.last_update)}
                    </p>
                    <p>Date Submitted: {formatDate(diagnosis.creation_date)}</p>
                    <p>
                      Health Officer Assigned: {info.first_name}{" "}
                      {info.last_name}
                    </p>
                  </Grid>
                  <Grid item>
                    
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
