import React from "react";
import VendorList from "./VendorList";

export default function Vendor(props) {
  return (
    <React.Fragment>
      <VendorList accessLevel={props.accessLevel}/>
    </React.Fragment>
  );
}
