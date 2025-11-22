/*
    This will be socket.io logic

    TODO:
    - Implement p2p comunication
    - Implement group comunication
    - Create chat general logic
*/

const socket = io({
    withCredentials: true,
    transports: ['websocket']
});

document.addEventListener('DOMContentLoaded', async () => {

    socket.on('connect', () => {
        alert('Connection succesfull');
    })

    socket.emit('ping', { message: 'testing server.io' });
    socket.on('pong', (data) => {
        alert('pong recieved ' + data.message);
    })

})