/*
    TODO
    Create socket core logic
    Responsabilities:
    - Basic behavior (connect/disconnect)
    - Event handling
    - Conection status
*/
const socket = io({
    withCredentials: true,
    transports: ['websocket']
});

document.addEventListener('DOMContentLoaded', () => {

    socket.on('connection', () => {
        console.log('Connection made succesfully');
    })

    socket.emit('ping', { message: 'connected to server' })
})