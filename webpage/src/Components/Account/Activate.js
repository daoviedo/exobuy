import React from "react";
import queryString from "query-string";
import axios from "axios";

function Activate() {
  const [code] = React.useState(queryString.parse(window.location.search).key);
  const [display, changeDisplay] = React.useState("loading");
  React.useEffect(() => {
    //api call that activates account with code
    axios
      .patch(
        "https://api.dev.myexobuy.com/account/activate/" + code,
        {},
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(result => changeDisplay(result.data.message))
      .catch(err => console.log(err));
  }, [code]);
  return (
    <React.Fragment>
      <p>{display}</p>
    </React.Fragment>
  );
}

export default Activate;
