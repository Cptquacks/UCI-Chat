const db = require('../db/db'); //Essential
const sessionController = require('./sessionController');

async function register(req, res) {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            console.error('[ AUTH ERROR ] Failed to register user, no credentials');
            return res.status(400).send({ success: false, error: 'could not create user' });
        }

        const response = await db.createUser({ username, email, password, role });
        if (!response || response.error) {
            return res.send(response);
        }

        req.session.user = {
            sessionEmail: email,
            sessionPassword: password
        };

        await sessionController.saveSession(req.session);
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
        if (!email || !password) {
            console.error('[ AUTH ERROR ] No credentials');
            return res.status(500).send({ success: false, error: 'No credentials' });
        }

        const response = await db.loginUser({ email, password });
        if (!response || response.error) {
            console.error('[ AUTH ERROR ] Bad response');
            return res.status(500).send(response);
        }

        req.session.user = {
            sessionEmail: email,
            sessionPassword: password
        };

        await sessionController.saveSession(req.session);
        return res.status(200).send(response);
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
            return res.status(500).send({ success: false, error: 'could not find user' });
        }

        await sessionController.deleteSession(req.session);
        res.clearCookie('uci_chat_session');

        return res.send({ success: true, message: 'cookie cleared' });
    }
    catch (err) {
        console.error('[ AUTH ERROR ] Failed to logout user:', err);
    }
    return res.status(500).send({ success: false, error: 'could not logout user' });
}

async function update(req, res) {
    try {
        if (!req.session.user) {
            console.error('[ AUTH ERROR ] Could not retrieve session');
            return res.status(400).send({ success: false, message: 'could not get user session' });
        }

        const { sessionEmail, sessionPassword } = req.session.user;
        const { newEmail, newPassword, newName } = req.body;

        if (!sessionEmail || !sessionPassword) {
            console.error('[ AUTH ERROR ] Could not retrieve session info');
            return res.status(500).send({ success: false, message: 'could not get credentials' });
        }


        const response = await db.updateUser(
            { sessionEmail, sessionPassword },
            { newEmail, newPassword, newName }
        );
        if (!response || response.error) {
            console.error('[ AUTH ERROR ] Bad response ' + response.error);
            return res.status(500).send(response);
        }


        req.session.user = {
            sessionEmail: newEmail || sessionEmail,
            sessionPassword: newPassword || sessionPassword
        };

        await sessionController.saveSession(req.session);
        return res.status(200).send(response);
    }
    catch (err) {
        console.error('[ AUTH ERROR ] User could not be updated ' + err);
        return res.status(500).send({ success: false, error: 'Could not update user' });
    }
}

module.exports = { register, login, logout, update };