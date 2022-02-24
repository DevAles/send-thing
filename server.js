import http from 'http';
import express from 'express';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

sockets.on('connection', function(socket){
    const userId = socket.id;

    console.log('> Connected to socket with user: ' + userId)
    
    socket.on('message', function(messageData){
        console.log(`> Server received a message from: ${messageData.username}:
        ${messageData.message}`)

        sockets.emit('message', messageData);
        console.log('> Message send to client.')
    })
})

app.use(express.static(`public`));
server.listen(8080, function() {
    console.log('> Server listening on port 8080');
})