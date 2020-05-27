import React, { useState, useEffect } from "react";
import xrayLogo from "../../assets/xray.png";
import { Button, TextField, Grid } from "@material-ui/core";

export default function Xray({ xray, existingXray }) {
  const [xrayData, setXrayData] = useState(
    existingXray !== null ? existingXray : null
  );

  useEffect(() => {
    xray(xrayData);
    return () => {};
  }, [xrayData, xray]);

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <img src={xrayLogo} alt="xray" />
        <p>Upload X-Ray Sample</p>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="column"
          spacing={2}
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <TextField
              disabled
              id="outlined-disabled"
              label="File"
              variant="outlined"
              value={xrayData == null ? "" : xrayData.name}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" component="label">
              Upload File
              <input
                type="file"
                id="img"
                name="img"
                accept="image/png"
                style={{ display: "none" }}
                onChange={(event) => {
                  setXrayData(new Blob(event.target.files[0]));
                }}
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
