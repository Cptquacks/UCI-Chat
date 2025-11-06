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
        if (!response) {
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
        if (!response) {
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
            return res.status(404).send({ success: false, error: 'could not find user' });
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
        const { newEmail, newUser, newPassword } = req.body;
        const response = await db.updateUser({ newEmail, newUser, newPassword });

        if (!response) {
            console.error('[ AUTH ERROR ] Response invalid');
            return res.status(500).send({ success: false, error: 'Could not update user' });
        }

        req.session.user = {
            sessionEmail: newEmail,
            sessionPassword: newPassword
        };

        await sessionController.saveSession(req.session);
        return res.status(200).send({ success: true, data: response });
    }
    catch (err) {
        console.error('[ AUTH ERROR ] User could not be updated ' + err);
        return res.status(500).send({ success: false, error: 'Could not update user' });
    }
}





module.exports = { register, login, logout, update };