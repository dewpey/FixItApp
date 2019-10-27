import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import styled from "styled-components";
import { subscribeToTimer } from "./api";
import Button from "@material-ui/core/Button";
import openSocket from "socket.io-client";
import axios from "axios";
import DoneIcon from '@material-ui/icons/Done';
const socket = openSocket("http://localhost:3005");
const AngleCard = styled(Card)`
  padding: 25px 25px 25px 25px;
`;

export default class Angle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: 0,
      remaining: 3,
      isStarted: false,
      isComplete: false
    };
    socket.on("info", results => {
      this.setState({ angle: Math.round(results.angle) });
      this.setState({ remaining: results.remaining });
    });
    socket.emit("subscribeToTimer", 300);
    this.doSomething = this.doSomething.bind(this);
  }

  doSomething() {
    setTimeout(() => {
      axios.get("http://localhost:8080/api/calibrate");
      this.setState({ isStarted: true });
      console.log(this.state);
    }, 5000);

    console.log("angle:" + this.state.angle);
  }

  markCompleted() {
    this.setState({ isComplete: true });
  }

  render() {
    return (
      <div
        width="500px"
        style={{
          flex: 1,
          flexDirection: "row"
        }}
      >
        <Container>
          <h1>Pythagoras</h1>
          <h2>Drew's Physical Therapy</h2>
          <AngleCard>
            <Grid>
              <Grid item xs={12}>
              {this.state.remaining <= 0 ? (
                <DoneIcon/>
                ) : (
                  <div />
                )}
                3x Side Leg Raises
              </Grid>
              <Grid item m={12}>
                {!this.state.isStarted ? (
                  <Button variant="contained" onClick={this.doSomething}>
                    Begin
                  </Button>
                ) : (
                  <div />
                )}
              </Grid>
            </Grid>
          </AngleCard>
        </Container>
        {this.state.isStarted &&
        !this.state.isComplete &&
        this.state.remaining > 0 ? (
          <Container>
            <h1>Angle Goal: 45%</h1>
            <h2>Current Angle: {this.state.angle}°</h2>
            <h2>Remaining: {this.state.remaining}</h2>
            <iframe width="853" height="480" src="https://www.youtube.com/embed/6b1hu6iSqok" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </Container>
        ) : (
          <div />
        )}
        {this.state.remaining <= 0 ? (
          <Container>
            <h1>Completed!</h1>
          </Container>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
