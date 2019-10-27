import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import styled from "styled-components";

const Excercise = styled(Card)`
  padding: 25px 25px 25px 25px;
`;

export default class Sidebar extends React.Component {
  render() {
    return (
      <div width="500px" style={{ flex: 1, flexDirection: "row" }}>
        <Container>
          <h2>Exercises</h2>
          <Excercise>3x Leg Raises</Excercise>
        </Container>
      </div>
    );
  }
}
