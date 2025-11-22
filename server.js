/*
    Server essentials
*/ 
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const favicon = require('serve-favicon');
require('dotenv').config();


/*
    Propietary imports
*/

//Controllers
const authController = require('./src/controllers/authController');
const sessionController = require('./src/controllers/sessionController');
const socketController = require('./src/controllers/socketController');

//models
const sessionModel = require('./src/models/sessionModel');

//utils
const ipAddr = require('./src/utils/ipAddr');

//initializers
const app = express();
const server = http.createServer(app);
const io = socket(server);

//use dependencies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(__dirname+'/src/public/images/favicon.ico'));

app.use(sessionModel);
io.engine.use(sessionModel);

//public routes
app.use(express.static(__dirname + '/src/public'));
app.use(express.static(__dirname + '/src/public/html'));
app.use(express.static(__dirname + '/src/public/styles'));
app.use(express.static(__dirname + '/src/public/scripts'));
app.use(express.static(__dirname + '/src/public/images'));


//status getter
app.get('/server/status', (req, res) => {
    res.send({
        status: server.listening,
        uptime: process.uptime() + 's',
        host: 'HP Laptop'
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/src/public/html/index.html');
});

/*
    Account manipulation
*/

app.get('/api/auth', sessionController.hasSession, (req, res) => {
    res.redirect('/chat/profile');
});

app.get('/api/login', (req, res) => {
    res.sendFile(__dirname + '/src/public/html/login-page.html');
});

app.get('/api/register', (req, res) => {
    res.sendFile(__dirname + '/src/public/html/register-page.html');
});


/*
    Profile manipulation
*/
app.get('/chat/profile', sessionController.hasSession, (req, res) => {
    res.sendFile(__dirname + '/src/public/html/profile-page.html');
});

app.get('/api/profile', sessionController.hasSession, async (req, res) => {
    const response = await sessionController.getSession(req.session);
    console.log(response);
    res.send(response);
});


/* 
    Chat routes
*/
app.get('/chat/index', sessionController.hasSession, async (req, res) => {
    res.sendFile(__dirname + '/src/public/html/chat-index.html');
});


/*
    Post routes
*/
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.post('/api/logout', sessionController.hasSession, authController.logout);
app.post('/api/update', sessionController.hasSession, authController.update);

/*
    404 ERR
*/
app.use((req, res) => {
    console.log('[ ERROR ] 404 not found');

    res.sendFile(__dirname + '/src/public/html/404-error.html');
});


/* 
    Socket functionallity
*/
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

io.use(socketController.socketAuth);

io.on('connection', (socket) => {

    socketController.socketConnection(socket);
    socket.on('disconnect', () => {
        console.log('[ LOG ] user disconnected');
    });

    socket.on('ping', (data) => {
        console.log('[ LOG ] data recieved ' + data.message);
        socket.emit('pong', { message: 'Data recepted', timeStamp: new Date() });
    });

});



// Server runner
const PORT = process.env.PORT ?? 3000;
server.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('[ ERROR ] Error initializing server:', err);
        return;
    }

    console.log(`[ SUCCESS ] Server hosted at http://localhost:${PORT}`);
    console.log(`[ SUCCESS ] Server hosted at http://${ipAddr()}:${PORT}`);
});