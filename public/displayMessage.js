export default function showMessage(messageData, userId){
    const messageDisplayer = document.getElementById('message-displayer')
    const defineClass = messageData.userId == userId ? 
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