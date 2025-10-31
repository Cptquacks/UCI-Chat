const express = require('express');
const http = require('http');
const socket = require('socket.io');

//propietary imports
const ipAddr = require('./src/utils/ipAddr');
const authController = require('./src/controllers/authController');


const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(express.static(__dirname + '/src/public'));
app.use(express.static(__dirname + '/src/public/html'));
app.use(express.static(__dirname + '/src/public/styles'));
app.use(express.static(__dirname + '/src/public/scripts'));

app.get('/status', (req, res) => {
    res.send({
        status: server.listening,
        uptime: process.uptime() + 's',
        host: app.name
    });
});

app.get('/api/login', (req, res) => {
    const response = authController.hasAuth(req, res).success;

    if (response) {
        return;
    }

    res.sendFile(__dirname + '/src/public/html/login-page.html');

});
app.get('/api/register', (req, res) => {
    res.sendFile(__dirname + '/src/public/html/register-page.html');
});

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.post('/api/logout', authController.logout);

io.on('connection', (socket) => {

    console.log('[ LOG ] User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('[ LOG ] user disconnected');
    });

});

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('[ ERROR ] Error initializing server:', err);
        return;
    }

    console.log(`[ SUCCESS ] Server hosted at http://localhost:${PORT}`);
    console.log(`[ SUCCESS ] Server hosted at http://${ipAddr()}:${PORT}`);
});