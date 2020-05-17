import React from "react";
import xrayLogo from "../../assets/xray.png";
import { Button } from "@material-ui/core";

export default function Xray() {
  return (
    <div>
      <img src={xrayLogo} alt="xray" />
      <p>Upload X-Ray Sample</p>
      <Button variant="contained" component="label">
        Upload File
        <input type="file" style={{ display: "none" }} />
      </Button>
    </div>
  );
}
