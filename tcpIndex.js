var net = require('net');
var http = require('http');
var WebSocketServer = require('websocket').server;
var rCur = [{x:-1, y:-1},{x:-1, y:-1},{x:-1, y:-1}]
var rCal = [{x:-1, y:-1},{x:-1, y:-1},{x:-1, y:-1}]
var currentAngle = 0.0;
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var calibrated = false;
var remaining = 3;
var goalAngle = 55.0;
var awaiting0 = false;
let AWS = require('aws-sdk');
var emailsent = false;
AWS.config.update({region: 'us-west-2'})
const ses = new AWS.SES();
var cors = require('cors')
app.use(cors())
const io = require('socket.io')();


io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
      console.log('client is subscribing to timer with interval ', interval);
      setInterval(() => {
        client.emit('info', {angle: currentAngle, remaining: remaining});
      }, interval);
    });
  });

var server = net.createServer(function (socket) {
    socket.write('Intel Depth Camera has connected\r\n');
    socket.on('data', function (data) {
        const results = processString(data.toString());
        if(results[9].x > 1){
            console.log(results[8])
            rCur[0] = results[11]
            rCur[1] = results[12]
            rCur[2] = results[13]
        }
        calculateAngle();
        console.log("current")
        console.log(rCur)
        console.log("calibrated")
        console.log(rCal)
        
        /*
        server.send(JSON.stringify({
            data: data,
            angle: currentAngle
        }));
        */
        
    });
    socket.on('error', function (e) {
        console.log(e)
    });
    socket.pipe(socket);

});

function processString(input) {
    const items = input.match(/^\d+|\d+\b|\d+(?=\w)/g);
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
    if(calibrated){
        const side = Math.sqrt(
            (rCal[0].x - rCal[2].x) * (rCal[0].x - rCal[2].x) + (rCal[0].y - rCal[2].y) * (rCal[0].y - rCal[2].y));

        const hypo = Math.sqrt(
            (rCur[0].x - rCur[2].x) * (rCur[0].x - rCur[2].x) + (rCur[0].y - rCur[2].y) * (rCur[0].y - rCur[2].y));


        const newAngle = 180/3.14*Math.acos(side / hypo);
        if(newAngle){
            currentAngle = newAngle
            if (currentAngle > goalAngle && !awaiting0){
                remaining--;
                awaiting0 = true
            }
            if(remaining == 0 && !emailsent){
                sendEmail()
                emailsent = true
            }
            if (currentAngle < 15.0){
                awaiting0 = false
            }
        } 
        console.log(currentAngle);

    }
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
router.get('/calibrate', function (req, res) {
    rCal[0] = rCur[0]
    rCal[1] = rCur[1]
    rCal[2] = rCur[2]
    calibrated = true
    res.json({
        message: 'hooray!'
    });
});

async function sendEmail(){
    return await ses.sendTemplatedEmail({
        Destination: {
            ToAddresses: ['drew1patel@gmail.com'],
            CcAddresses: [],
            BccAddresses: []
        },
        Source: 'drew1patel@gmail.com',
        Template: 'pythag-20191027054423',
        TemplateData: '{}' /* required */
    }, function (err, data) {
        if (err){ 
            console.log(err, err.stack);
            
         } // an error occurred
        else{
             console.log(data);  
            
        }         // successful response
    });
}

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

const port1 = 3005;
io.listen(port1);
console.log('listening on port ', port1);