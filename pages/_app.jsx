import { useEffect } from "react";
import io from "socket.io-client"
import message from "../data/message.js"
import credentials from "../data/credentials.js"
import "./style.css";

function Home() {
    return <main className="main-content">
        <header>
            <h1>Send Thing</h1>
        </header>

        <article className='message-displayer' id="message-displayer"></article>

        <article className="send-message" id="send-message">
            <input type="text" className="message-input" id="message-input"></input>
        </article>

        <script type="module">
            {socketClient()}
        </script>
    </main>
}

function socketClient() {
    useEffect(() => {
        fetch("/api/socket-server").finally(() => {
            const socket = io();
            const messageVar = message(socket);
            const credentialsVar = credentials(socket);
            let logged = false;

            const body = window.document.body

            const userCredentials = {
                username: window.prompt("Input username:"),
                password: window.prompt("Input password:"),
            }

            const username = userCredentials.username

            credentialsVar.verifyAndSendToServer(userCredentials)

            body.addEventListener('keydown', function (event) {
                const message = window.document.getElementById('message-input').value

                if (event.key === 'Enter' && username && message && logged) {
                    messageVar.send(username, message)
                }
            })

            socket.on('connect', () => {
                console.log('Connected to socket with user id: ' + username)
            });

            socket.on('message', (messageData) => {
                if (logged) {
                    messageVar.display(messageData, username);
                }
            })

            socket.on('sucessful-login', () => {
                logged = true;
            })

            socket.on('invalid-login', () => {
                window.alert('Invalid Login, please try again')
                window.location.reload();
            })
        })
    }, []);
}

export default Home;