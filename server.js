import http from 'http';
import express from 'express';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

sockets.on('connection', function(socket){
    const user = socket.id;

    console.log('Connected to socket with user: ' + user)
    socket.on('message', function(message){
        socket.emit('message', message);
    })
})

app.use(express.static(`public`));
server.listen(8080, function() {
    console.log('Server listening on port 8080');
})