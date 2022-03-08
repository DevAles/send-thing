export default function credentials(socket){
    function verifyAndSendToServer(userCredentials) {
        try{
            if (userCredentials.username.includes(' ')) throw "Please not use spaces in username"
            if (userCredentials.password.includes(' ')) throw "Please not use spaces in password"
            if (userCredentials.username == undefined) throw 'Invalid Username, try again.'
            if (userCredentials.password == undefined) throw 'Invalid Password, try again.'
            if (userCredentials.username.length <= 5) throw 'Username must be at least 5 characters long.'
            if (userCredentials.password.length <= 5) throw 'Password must be at least 5 characters long.'
        } catch (err){
            window.alert(err)
            window.location.reload();
        }
        socket.emit('send-credentials', userCredentials)
    }

    function verifyAndSendToClient(jsonParsed, usernameGlobal, passwordGlobal) {
        if (jsonParsed[usernameGlobal] !== undefined) {
            if (jsonParsed[usernameGlobal] == passwordGlobal) {
                socket.emit('sucessful-login');
            } else {
                socket.emit('invalid-login');
            }
        } else {
            jsonParsed[usernameGlobal] = passwordGlobal;
            socket.emit('sucessful-login');
        }
    }
    return {
        verifyAndSendToServer,
        verifyAndSendToClient
    }
}