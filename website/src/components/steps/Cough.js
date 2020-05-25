import React, { useState } from "react";
import coughLogo from "../../assets/cough.png";
import { IconButton, Grid, Button } from "@material-ui/core";
import { ReactMic } from "react-mic";
import { makeStyles } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import StopIcon from "@material-ui/icons/Stop";
import BackgroundImage from "../../assets/audio.png";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#333333",
  },
  soundWave: {
    width: "100%",
    height: "70px",
  },
  oscilloscope: {
    height: "125px",
    marginTop: "-127px",
  },
  scrim: {
    height: "inherit",
    opacity: "0.4",
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: "repeat",
  },
}));

export default function Cough() {
  const classes = useStyles();

  const [record, setRecord] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState("");

  const onStop = (recordedBlob) => {
    console.log("recordedBlob is: ", recordedBlob);
    setRecordedBlob(recordedBlob.blobURL);
  };

  // const onData = (recordedBlob) => {
  //   console.log("chunk of real-time data is: ", recordedBlob);
  // };

  const clickRecord = () => {
    setRecord(!record);

    setTimeout(() => {
      setRecord(false);
    }, 21000);
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <img src={coughLogo} alt="cough" />
        <h3>Cough Sample</h3>
      </Grid>
      <Grid item>
        <ul
          style={{
            marginTop: "-2px",
            paddingLeft: 0,
            listStyle: "none",
            listStyleType: "none",
          }}
        >
          <li>1. Breath In</li>
          <li>2. Click Record</li>
          <li>3. Hold for 20 Seconds</li>
        </ul>
      </Grid>
      <Grid item>
        <ReactMic
          record={record}
          className={classes.soundWave}
          onStop={onStop}
          strokeColor="#333333"
          backgroundColor="white"
        />
        {/* <div className={classes.oscilloscope} hidden={record}>
          <div className={classes.scrim}></div>
        </div> */}
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <IconButton
              aria-label="record"
              color="secondary"
              onClick={clickRecord}
              style={{ backgroundColor: "grey" }}
              size="medium"
            >
              {record ? (
                <StopIcon fontSize="inherit" style={{ fill: "white" }} />
              ) : (
                <FiberManualRecordIcon
                  fontSize="inherit"
                  style={{ fill: "white" }}
                />
              )}
            </IconButton>
          </Grid>
          <Grid item>
            <audio
              controls
              controlsList="nodownload"
              src={recordedBlob}
            ></audio>
          </Grid>
          <Grid item>
            or&nbsp;&nbsp;&nbsp;
            <Button variant="contained" component="label">
              Upload File
              <input type="file" style={{ display: "none" }} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
