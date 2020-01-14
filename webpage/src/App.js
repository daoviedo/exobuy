import React from 'react';
import { Route } from "react-router-dom";
import Activate from './Components/Activate';

function App() {
  return (
    <React.Fragment>
        <Route path="/activate" exact component={Activate} />
    </React.Fragment>
  );
}

export default App;
