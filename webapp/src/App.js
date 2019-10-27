import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./Sidebar";
import Grid from "@material-ui/core/Grid";
import Angle from "./Angle";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Grid direction="row" style={{ height: "100vh" }}>
          <Grid item>
            <Sidebar />
          </Grid>
          <Grid item>
            <Angle />
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
