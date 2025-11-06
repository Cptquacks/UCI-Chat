const db = require('../db/db'); //Essential

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

async function getSession(session) {
    if (!session) {
        console.error('[ SESSION ERROR ] Error getting session');
        return { success: false, error: 'could not fetch sesssion' };
    }
    const { sessionEmail } = session.user;
    return await db.findByEmail(sessionEmail);
}

async function hasSession(req, res, next) {
    try {

        if (!req.session.user) {
            console.error('[ SESSION ERROR ] Session error at fetching session');
            return res.redirect('/api/login');
        }

        //console.log(req.session);
        const { sessionEmail } = req.session.user;

        if (!sessionEmail) {
            console.error('[ SESSION ERROR ] Session error at fetching email');
            return res.redirect('/api/login');
        }

        return next();

    }

    catch (err) {
        console.error('[ SESSION ERROR ] Failed to check session:', err);
    }
    return res.status(500).send({ success: false, error: 'could not check session' });
}

module.exports = { saveSession, deleteSession, getSession, hasSession };