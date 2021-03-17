import React from "react";
import DisplayGC from './DisplayGC';
export default function Admin() {
  console.log("admin page");
  return (
    <React.Fragment>
      <div style={{marginTop: 200}}/>
      
      <DisplayGC/>
    </React.Fragment>
  );
}
