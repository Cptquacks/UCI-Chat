const db = require('../db/db');

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

        req.session.user = {
            sessionEmail: email,
            sessionPassword: password
        };

        await saveSession(req.session);
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

        req.session.user = {
            sessionEmail: email,
            sessionPassword: password
        };

        await saveSession(req.session);
        return res.send(response);
    }
    catch (err) {
        console.error('[ AUTH ERROR ] Failed to login user:', err);
    }
    return res.status(500).send({ success: false, error: 'could not login user' });
}

async function logout(req, res) {
    try {
        const email = req.session.sessionEmail;
        const userExists = await db.findByEmail(email);

        if (!userExists) {
            console.error('[ AUTH ERROR ] Failed to logout user, don\'t exists');
            return res.status(404).send({ success: false, error: 'could not find user' });
        }

        await deleteSession(req.session);
        res.clearCookie('uci_chat_session');

        return res.send({ success: true, message: 'cookie cleared' });
    }
    catch (err) {
        console.error('[ AUTH ERROR ] Failed to logout user:', err);
    }
    return res.status(500).send({ success: false, error: 'could not logout user' });
}

async function hasAuth(req, res, next) {
    try {

        if (!req.session.user) {
            console.error('[ AUTH ERROR ] Auth error at fetching session');
            res.redirect('/api/login');
            return { success: false, error: 'could not fetch session' };
        }

        //console.log(req.session);
        const { sessionEmail } = req.session.user;

        if (!sessionEmail) {
            console.error('[ AUTH ERROR ] Auth error at fetching email');
            return { success: false, error: 'could not fetch email' };
        }

        next();
        return { success: true, message: '[ AUTH SUCCESS ] Success at fetching session' };

    }

    catch (err) {
        console.error('[ AUTH ERROR ] Failed to check auth:', err);
    }
    return res.status(500).send({ success: false, error: 'could not check auth' });
}

async function saveSession(session) {
    return new Promise((resolve, reject) => {
        session.save((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function deleteSession(session) {
    return new Promise((resolve, reject) => {
        session.destroy((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = { register, login, logout, hasAuth };