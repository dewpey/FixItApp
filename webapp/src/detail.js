import React from "react";
var net = require("net");

server.listen(5000, "127.0.0.1");

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input:
        "424,141 443,152 435,156 428,171 398,159 450,152 439,156 394,156 465,212 444,555 422,102 458,208 331,321 555,222 666,222 428,141 123,555 435,137 129",
      current: [],
      calibration: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const results = this.processString(this.state.input);
    this.setState({ current: results });
  }

  initServer() {
    const server = net.createServer(function(socket) {
      socket.write("Intel Depth Camera has connected\r\n");
      socket.on("data", function(data) {
        console.log(data.toString());
      });
      socket.on("error", function(e) {
        console.log(e);
      });
      socket.pipe(socket);
    });
  }

  processString(input) {
    const items = input.match(/^\d+|\d+\b|\d+(?=\w)/g);
    console.log(items);
    var newArray = [items.length - 1];
    var i;
    for (i = 0; i < items.length - 1; i += 2) {
      newArray.push({ x: items[i], y: items[i + 1] });
    }
    return newArray;
  }

  handleCalibrate() {
    this.setState({ calibration: this.state.current });
    this.setState({
      current: this.processString(
        "222,133 423,112 435,116 428,131 318,129 433,122 433,156 394,156 465,212 444,555 422,102 458,208 331,321 555,222 666,222 428,141 123,555 435,137 129"
      )
    });
  }

  calculateAngle() {
    const side = Math.sqrt(
      this.state.calibration[8].x * this.state.calibration[8].x +
        this.state.calibration[8].y * this.state.calibration[8].y
    );

    const hypo = Math.sqrt(
      this.state.current[8].x * this.state.current[8].x +
        this.state.current[8].y * this.state.current[8].y
    );

    console.log(hypo);

    const theta = Math.acos(side / hypo);

    console.log(theta);
  }

  render() {
    return (
      <div>
        <h1> Hello, world! </h1>{" "}
        <button onClick={() => this.handleClick()}>Format Data</button>
        <button onClick={() => this.handleCalibrate()}>Calibrate</button>
        <button onClick={() => this.calculateAngle()}>Calculate Angle</button>
      </div>
    );
  }
}
