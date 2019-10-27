var net = require('net');

var server = net.createServer(function(socket) {
    socket.write('Intel Depth Camera has connected\r\n');
    socket.on('data', function (data) {
        console.log(data.toString())
    });
    socket.on('error', function(e){	
        console.log(e)
    });
    socket.pipe(socket);
    
});

server.listen(5000, '127.0.0.1');

