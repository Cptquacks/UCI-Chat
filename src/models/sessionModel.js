const session = require('express-session');

const sessionModel = session({
    secret: 'uci-chat-secret-dev',
    resave: false,
    unset: false,
    saveUninitialized: false,
    name: 'uci_chat_session',
    data: {
        email: null,
        password: null
    },
    cookie: {
        secure: false,
        maxAge: 48 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
    }
});

module.exports = sessionModel;