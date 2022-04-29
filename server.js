import http from 'http';
import express from 'express';
import { Server } from "socket.io";
import fs from 'fs';

let emptyJson = true;
const jsonData = fs.readFileSync('./credentials/users.json')
const jsonParsed = emptyJson ? {} : JSON.parse(jsonData)

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

sockets.on('connection', function(socket){
    let usernameGlobal;
    let passwordGlobal;

    socket.on('send-credentials', function(credentials){
        usernameGlobal = credentials.username
        passwordGlobal = credentials.password
        console.log('> Connected to socket with user: ' + credentials.username)

        if (jsonParsed[usernameGlobal] !== undefined) {
            if (jsonParsed[usernameGlobal] == passwordGlobal) {
                socket.emit('sucessful-login')
            } else {
                socket.emit('invalid-login')
            }
        } else {
            jsonParsed[usernameGlobal] = passwordGlobal
            socket.emit('sucessful-login')
        }
        const jsonString = JSON.stringify(jsonParsed)

        fs.writeFile('./credentials/users.json', jsonString, function(err){

            if (err) throw err
            console.log('> Add User Credentials')
            emptyJson = false
        })
    })

    socket.on('message', function(messageData){
        console.log(`> Server received a message from: ${messageData.username}:
        ${messageData.message}`)

        sockets.emit('message', messageData);
        console.log('> Message send to client.')
    })
})
app.use(express.static(`public`));

app.get('/credentials', (req, res) => {
    res.status(403).send(`
        <style>
            body {
                font-family: sans-serif;
                font-size: 1.5em;
                text-align: center;
            }
        </style>

        <h1 style="color: red;">403 Forbidden</h1>
        <p>You don't have permission to access this page.</p>
    `)
});

app.get('*', (req, res) => {
    res.redirect('/');
    res.end();
});

server.listen(80, function() {
    console.log('> Server listening on port 80');
})