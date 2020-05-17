import React from "react";
import temperatureLogo from "../../assets/temperature.png";
import { Button } from "@material-ui/core";

export default function Temperature() {
  return (
    <div>
      <img src={temperatureLogo} alt="thermometer" />
      <p>Input Temperature</p>
      <Button variant="contained" component="label">
        Upload File
        <input type="file" style={{ display: "none" }} />
      </Button>
    </div>
  );
}
