const db = require('../db/db');
const session = require('../models/sessionModel');


async function register(req, res) {
    try {
        const { username, email, password, role } = req.body;
        const response = await db.createUser({ username, email, password, role });

        if (!username || !email || !password) {
            console.error('[ AUTH ERROR ] Failed to register user, no credentials');
            return res.status(400).send({ success: false, error: 'could not create user' });
        }

        if (!response) {
            return res.send(response);
        }

        req.session = session;
        req.session.data = response;
        req.session.data.password = password;

        return res.send(response);
    }
    catch (err) {
        console.error('[ AUTH ERROR ] Failed to register user:', err);
    }
    return res.status(400).send({ success: false, error: 'could not create user' });
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const response = await db.loginUser({ email, password });

        if (!response) {
            return res.send(response);
        }

        req.session = session;
        req.session.data = response;
        req.session.data.password = password;

        return res.send(response);
    }
    catch (err) {
        console.error('[ AUTH ERROR ] Failed to login user:', err);
    }
    return res.status(500).send({ success: false, error: 'could not login user' });
}

async function logout(req, res) {
    try {
        const email = req.body.email;
        const userExists = db.findByEmail(email);

        if (!userExists) {
            console.error('[ AUTH ERROR ] Failed to logout user, don\'t exists');
            return res.status(404).send({ success: false, error: 'could not find user' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('[ AUTH ERROR ] Auth error at deleting session');
                return res.status(500).send({ success: false, error: 'could not logout user' });
            }
        });

        res.clearCookie('uci_chat_session');
        return res.send({ success: true, message: 'cookie cleared' });
    }
    catch (err) {
        console.error('[ AUTH ERROR ] Failed to logout user:', err);
    }
    return res.status(500).send({ success: false, error: 'could not logout user' });
}

async function hasAuth(req, res) {
    try {

        if (!req.session) {
            console.error('[ AUTH ERROR ] Auth error at fetching session');
            return { success: false, error: 'could not fetch session' };
        }

        const { email } = req.session.data;
        if (!email) {
            console.error('[ AUTH ERROR ] Auth error at fetching email');
            return { success: false, error: 'could not fetch email' };
        }

        login(req, res);
        return { success: true, message: '[ AUTH SUCCESS ] Success at fetching session' };

    }

    catch (err) {
        console.error('[ AUTH ERROR ] Failed to check auth:', err);
    }
    return res.status(500).send({ success: false, error: 'could not check auth' });
}

module.exports = { register, login, logout, hasAuth };