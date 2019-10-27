
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3005');
async function subscribeToTimer(interval, cb) {
    socket.on('info', timestamp => {
        console.log(timestamp)
        return timestamp});
  socket.emit('subscribeToTimer', 300);
} 
export { subscribeToTimer }