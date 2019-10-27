import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import styled from "styled-components";

const AngleCard = styled(Card)`
  padding: 25px 25px 25px 25px;
`;

export default class Angle extends React.Component {
  componentDidMount() {
    const ws = new WebSocket("ws://127.0.0.1:5000");

    ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      //this.setState({ dataFromServer: message });
      console.log(message);
    };
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
          <AngleCard></AngleCard>
        </Container>{" "}
      </div>
    );
  }
}
