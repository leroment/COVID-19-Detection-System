import React from "react";
import coughLogo from "../../assets/cough.png";
import { Button } from "@material-ui/core";

export default function Cough() {
  return (
    <div>
      <img src={coughLogo} alt="cough" />
      <p>Upload Cough Sample</p>
      <Button variant="contained" component="label">
        Upload File
        <input type="file" style={{ display: "none" }} />
      </Button>
    </div>
  );
}
