import http from 'http';
import express from 'express';
import { Server } from "socket.io";
import fs from 'fs';
import credentials from './public/credentials.js';

let emptyJson = true; //Object.keys()
const jsonData = fs.readFileSync('./credentials/users.json')
const jsonParsed = emptyJson ? {} : JSON.parse(jsonData)

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

sockets.on('connection', function(socket){
    const credentialsVar = credentials(socket)
    let usernameGlobal;
    let passwordGlobal;

    socket.on('send-credentials', function(credentials){
        usernameGlobal = credentials.username
        passwordGlobal = credentials.password
        console.log('> Connected to socket with user: ' + credentials.username)

        credentialsVar.verifyAndSendToClient(jsonParsed,
            usernameGlobal, passwordGlobal, socket);

        const jsonString = JSON.stringify(jsonParsed)

        fs.writeFile('./credentials/users.json', jsonString, function(err){

            if (err) throw err
            console.log('> Add User Credentials')
            emptyJson = false
        })
    })
    
    socket.on('send-message', function(messageData){
        console.log(`> Server received a message from: ${messageData.username}:
        ${messageData.message}`)

        socket.emit('sned-message', messageData);
        console.log('> Message send to client.')
    })
})

app.use(express.static(`public`));
server.listen(80, function() {
    console.log('> Server listening on port 80');
})
