import React, { useState, useEffect } from "react";
import temperatureLogo from "../../assets/temperature.png";
import { TextField, Grid } from "@material-ui/core";

export default function Temperature({ temp, existingTemp }) {
  const [tempData, setTempData] = useState(
    existingTemp !== 0 ? existingTemp : 0
  );

  useEffect(() => {
    temp(tempData);
    return () => {};
  }, [tempData, temp]);

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <img src={temperatureLogo} alt="thermometer" />
        <p>Input Temperature</p>
        <TextField
          id="outlined-number"
          label="&deg;C"
          type="number"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: "0", max: "100" }}
          variant="outlined"
          value={tempData}
          onChange={(event) => {
            setTempData(event.target.value);
          }}
        />
        {/* <Button
          onClick={() => {
            console.log(tempData);
            temp(tempData);
          }}
        >
          Set Temperature
        </Button> */}
      </Grid>
    </Grid>
  );
}
