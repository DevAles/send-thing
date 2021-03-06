export default function message(socket){

    function display(messageData, username){
        const messageDisplayer = document.getElementById('message-displayer')
        const defineClass = messageData.username == username ? 
        'class="my-message-div"': 'class="other-message-div"';
    
        const messageHTML = 
        `
        <div ${defineClass}>
            <p class="message-text">${messageData.message}</p>
            <p class="message-info">${messageData.username}</p>
        </div>
        `
        messageDisplayer.innerHTML += messageHTML
        messageDisplayer.scroll(10000000, 10000000)
    }

    function send(username, message){
        
        const messageData = {
            username,
            message
        }

        window.document.getElementById('message-input').value = ''
        console.log(`${messageData.username}: send message to server`)
        socket.emit('message', messageData)
    }
    return{
        display,
        send
    }
}