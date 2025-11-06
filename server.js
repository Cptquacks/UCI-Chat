const express = require('express');
const http = require('http');
const socket = require('socket.io');

/*
    Propietary imports
*/
//Controllers
const authController = require('./src/controllers/authController');
const sessionController = require('./src/controllers/sessionController');

//models
const sessionModel = require('./src/models/sessionModel');

//utils
const ipAddr = require('./src/utils/ipAddr');


const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionModel);

app.use(express.static(__dirname + '/src/public'));
app.use(express.static(__dirname + '/src/public/html'));
app.use(express.static(__dirname + '/src/public/styles'));
app.use(express.static(__dirname + '/src/public/scripts'));


app.get('/server/status', (req, res) => {
    res.send({
        status: server.listening,
        uptime: process.uptime() + 's',
        host: 'HP Laptop'
    });
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

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.post('/api/logout', sessionController.hasSession, authController.logout);
app.post('/api/update', sessionController.hasSession, authController.update);

app.use((req, res) => {
    console.log('[ ERROR ] 404 not found');

    res.sendFile(__dirname + '/src/public/html/404-error.html');
});

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