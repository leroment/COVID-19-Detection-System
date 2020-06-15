import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { Checkmark } from "react-checkmark";
import {
  Dialog,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  Backdrop,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Temperature from "./steps/Temperature";
import Cough from "./steps/Cough";
import Xray from "./steps/Xray";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(7),
    marginRight: theme.spacing(7),
    textAlign: "center",
  },
  animation: {
    width: "300px",
    height: "300px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function getSteps() {
  return ["Enter Temperature", "Upload Cough Sample", "Upload X-Ray Image"];
}

export default function NewDiagnosis(props) {
  const { open, parentCallback } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [theTemp, setTheTemp] = useState(0);
  const [theCough, setTheCough] = useState(null);
  const [theXray, setTheXray] = useState(null);
  const [uploading, setUploading] = useState(false);
  // const [skipped, setSkipped] = useState(new Set());
  const steps = getSteps();

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Temperature
            temp={(temp) => {
              setTheTemp(temp);
            }}
            existingTemp={theTemp}
          />
        );
      case 1:
        return (
          <Cough
            cough={(cough) => {
              setTheCough(cough);
            }}
            existingCough={theCough}
          />
        );
      case 2:
        return (
          <Xray
            xray={(xray) => {
              setTheXray(xray);
            }}
            existingXray={theXray}
          />
        );
      default:
        return "Unknown step";
    }
  }

  // const isStepOptional = (step) => {
  //   return step === 1;
  // };

  // const isStepSkipped = (step) => {
  //   return skipped.has(step);
  // };

  const handleNext = () => {
    // let newSkipped = skipped;
    // if (isStepSkipped(activeStep)) {
    //   newSkipped = new Set(newSkipped.values());
    //   newSkipped.delete(activeStep);
    // }

    // Temperature
    if (activeStep === 0) {
      console.log(theTemp);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    // Cough
    if (activeStep === 1) {
      console.log(theCough);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    // Finish
    if (activeStep === 2) {
      console.log(theTemp);
      console.log(theCough);
      console.log(theXray);

      setUploading(true);

      // do the server push

      const data = new FormData();
      data.append("xray", theXray);
      data.append("audio", theCough);
      data.append("data", JSON.stringify({ temperature: parseFloat(theTemp) }));

      createDiagnosis(data);

      setTheXray(null);
      setTheCough(null);
      setTheTemp(0);
    }

    // setActiveStep((prevActiveStep) => prevActiveStep + 1);

    // setSkipped(newSkipped);
  };

  async function createDiagnosis(data) {
    await axios
      .post(
        `http://127.0.0.1:8000/api/users/${localStorage.getItem(
          "userId"
        )}/diagnoses/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setUploading(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     // You probably want to guard against something like this,
  //     // it should never occur unless someone's actively trying to break something.
  //     throw new Error("You can't skip a step that isn't optional.");
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  const handleClose = () => {
    parentCallback(false);
  };

  return (
    <div className={classes.root}>
      <Dialog
        onEnter={() => setActiveStep(0)}
        open={open}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          New Diagnosis
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              // if (isStepOptional(index)) {
              //   labelProps.optional = (
              //     <Typography variant="caption">Optional</Typography>
              //   );
              // }
              // if (isStepSkipped(index)) {
              //   stepProps.completed = false;
              // }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </DialogTitle>
        <DialogContent dividers>
          {/* <Typography gutterBottom>This is a gutter</Typography> */}
          {activeStep === steps.length ? (
            <div>
              <Checkmark size={80} />
              <Typography className={classes.instructions}>
                All steps completed - you&apos;re finished
              </Typography>
            </div>
          ) : (
            <div className={classes.instructions}>
              {getStepContent(activeStep)}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep === steps.length ? (
            <div>
              <Button onClick={handleClose} className={classes.button}>
                Close
              </Button>
            </div>
          ) : (
            <div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                {/* {isStepOptional(activeStep) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSkip}
                    className={classes.button}
                  >
                    Skip
                  </Button>
                )} */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}

          <Backdrop className={classes.backdrop} open={uploading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </DialogActions>
      </Dialog>
    </div>
  );
}
