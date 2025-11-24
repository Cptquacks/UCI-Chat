const onlineUsers = new Map();

async function socketAuth(socket, next) {
    try {
        console.log(socket.request.session);
        const session = socket.request.session;

        if (!session) {
            console.error('[ SOCKET ERROR ] Could not get session');
            return next(new Error('Could not get session'));
        }

        console.log('[ SOCKET SUCCESS ] Session obtained with email ' + session.sessionEmail);
        return next();
    }
    catch (err) {
        console.error('[ SOCKET ERROR ] could not check auth ' + err);
    }
}

async function socketConnection(socket) {
    if (!socket.request.session.user) {
        console.error('[ SOCKET LOG ] Could not retrieve user session');
        return { success: false, error: 'Could not retrieve user session' };
    }

    const { sessionEmail } = socket.request.session.user;
    console.log('[ SOCKET LOG ] User connected with email ' + sessionEmail);

    onlineUsers.set(sessionEmail, socket.id);
    console.log('[ SOCKET LOG ] No. Users ' + onlineUsers.size);

    return sessionEmail;
}

async function socketDisconnection(socket) {
    if (!socket.request.session.user) {
        console.error('[ SOCKET LOG ] Could not retrieve user session');
        return { success: false, error: 'Could not retrieve user session' };
    }

    const { sessionEmail } = socket.request.session.user;
    console.log('[ SOCKET LOG ] User disconnected with email ' + sessionEmail);

    onlineUsers.delete(sessionEmail, socket.id);
    console.log('[ SOCKET LOG ] No. Users ' + onlineUsers.size);

    return sessionEmail;
}

async function socketID(email) {
    return onlineUsers.get(email) || null;
}

async function socketGetusers() {
    return Array.from(onlineUsers.keys());
}

module.exports = { socketAuth, socketConnection, socketDisconnection, socketID, socketGetusers };