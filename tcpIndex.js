var net = require('net');

var current = []
var calibration = []
var currentAngle = 0.0;
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

var server = net.createServer(function (socket) {
    socket.write('Intel Depth Camera has connected\r\n');
    socket.on('data', function (data) {
        current = processString(data);
        console.log(data.toString())
        socket.write(data);
        processString(data);
    });
    socket.on('error', function (e) {
        console.log(e)
    });
    socket.pipe(socket);

});

function processString(input) {
    const items = input.match(/^\d+|\d+\b|\d+(?=\w)/g);
    console.log(items);
    var newArray = [items.length - 1];
    var i;
    for (i = 0; i < items.length - 1; i += 2) {
        newArray.push({
            x: items[i],
            y: items[i + 1]
        });
    }
    return newArray;
}

function calculateAngle() {
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
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

server.listen(5000, '127.0.0.1');
console.log("Websocket is listening");