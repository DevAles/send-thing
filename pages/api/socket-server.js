import { Server } from "socket.io";
import fs from 'fs';

function connectSocket(req, res) {

    if (!res.socket.server.io) {
        let emptyJson = true;
        const jsonData = fs.readFileSync('./credentials/users.json')
        const jsonParsed = emptyJson ? {} : JSON.parse(jsonData)
        const io = new Server(res.socket.server);

        io.on('connection', function (socket) {
            let usernameGlobal;
            let passwordGlobal;

            socket.on('send-credentials', function (credentials) {
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

                fs.writeFile('./credentials/users.json', jsonString, function (err) {

                    if (err) throw err
                    console.log('> Add User Credentials')
                    emptyJson = false
                })
            })

            socket.on('message', function (messageData) {
                console.log(`> Server received a message from: ${messageData.username}:
                ${messageData.message}`)

                io.emit('message', messageData);
                console.log('> Message send to client.')
            })
        })

        res.socket.server.io = io;
    }
    res.end();
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default connectSocket;
