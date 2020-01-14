import React from 'react';
import queryString from 'query-string';

function Activate() {
    const [code] = React.useState(queryString.parse(window.location.search).key);
    const [display, changeDisplay] = React.useState("loading");
    React.useEffect(() => {
        fetch('http://localhost:4000/account/activate/' + code, {
            method: 'PATCH'
        })
        .then(res => res.json())
        .then(result => {console.log(result); changeDisplay("Complete")})
    }, [])
    return (
        <React.Fragment>
            <p>{display}</p>
        </React.Fragment>
    );
}

export default Activate;
