import React, { useState } from "react";
import coughLogo from "../../assets/cough.png";
import { IconButton, Grid, Button } from "@material-ui/core";
import { ReactMic } from "react-mic";
import { makeStyles } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
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

export default function Cough(props) {
  const classes = useStyles();

  const [record, setRecord] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState("");
  const [count, setCount] = useState(20);

  const onStop = (recordedBlob) => {
    setRecord(false);
    console.log("recordedBlob is: ", recordedBlob);
    setRecordedBlob(recordedBlob.blobURL);
  };

  const clickRecord = () => {
    setRecord(true);
    setRecordedBlob("");

    var interval = setInterval(() => {
      setCount((prev) => (prev = prev - 1));
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setRecord(false);
      setCount(20);
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
            {record ? (
              <React.Fragment>{count}</React.Fragment>
            ) : (
              <IconButton
                aria-label="record"
                color="secondary"
                onClick={clickRecord}
                style={{ backgroundColor: "grey" }}
                size="medium"
              >
                <FiberManualRecordIcon
                  fontSize="inherit"
                  style={{ fill: "white" }}
                />
              </IconButton>
            )}
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
            <Button variant="contained" component="label" disabled={record}>
              Upload File
              <input type="file" style={{ display: "none" }} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
