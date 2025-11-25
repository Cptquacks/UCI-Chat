const prisma = require('../utils/prisma');
const validateEmail = require('../utils/validateEmail');
const encode = require('bcryptjs');


async function createUser(userData) {
    try {
        const encryptedPassword = await encode.hash(userData.password, 12);

        if (!validateEmail(userData.email)) {
            console.error('[ DB ERROR ] Error at fetching, user = ', user);
            return { success: false, message: 'bad email' };
        }

        const user = await prisma.user.create({
            data: {
                email: userData.email,
                userName: userData.username,
                password: encryptedPassword,
                role: userData.role || 'STUDENT',
                isAdmin: false
            },
            select: {
                id: true,
                email: true,
                userName: true,
                role: true,
                isAdmin: true
            }
        });

        console.log('[ AUTH SUCCESS ] Auth succes on user:', user);
        return { success: true, data: user };
    }
    catch (err) {
        if (err.code === 'P2002') {
            console.error('[ DB ERROR ] Error at creating user, email alredy exists');
            return { success: false, error: 'Email alredy exists' };
        }

        console.error('[ DB ERROR ] Error at creating user:', err.message);
        return { success: false, error: err.message };
    }
}

async function loginUser(userData) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: userData.email
            }
        });

        if (!validateEmail(userData.email)) {
            console.error('[ DB ERROR ] Error at fetching, bad email, user = ', user);
            return { success: false, error: 'bad email' };
        }

        if (!user) {
            console.error('[ DB ERROR ] Error at fetching, undefined data, user = ', user);
            return { success: false, error: 'bad credentials' };
        }

        const comparePasswords = await encode.compare(
            userData.password,
            user.password
        );

        if (!comparePasswords) {
            console.error('[ DB ERROR ] Error at fetching, password =', comparePasswords);
            return { success: false, error: 'bad credentials' };
        }

        const newUser = {
            id: user.id,
            email: user.email,
            username: user.userName,
            role: user.role,
            isAdmin: user.isAdmin
        };


        console.log('[ AUTH SUCCESS ] Login succes on user:', user);
        return { success: true, data: newUser };
    }
    catch (err) {
        console.error('[ DB ERROR ] Error at fetching user:', err.message);
        return { success: false, error: err.message };
    }
}

async function updateUser(oldData, newData) {
    try {
        const { sessionEmail, sessionPassword } = oldData;
        const { newEmail, newPassword, newName } = newData;


        const user = await prisma.user.findFirst({
            where: { email: sessionEmail }
        });
        if (!user) {
            console.error('[ DB ERROR ] Cannot update user, cannot retrieve user');
            return { success: false, error: 'user is a null value' };
        }


        const comparePasswords = await encode.compare(
            sessionPassword,
            user.password
        );
        if (!comparePasswords) {
            console.error('[ DB ERROR ] Not valid credentials');
            return { success: false, error: 'invalid credentials' };
        }


        const encryptedPassword = await encode.hash(
            ((newPassword !== '') ? newPassword : sessionPassword),
            12
        );
        await prisma.user.update({
            where: { email: sessionEmail },
            data: {
                email: newEmail || sessionEmail,
                userName: newName || user.userName,
                password: encryptedPassword,
                role: user.role || 'STUDENT',
                isAdmin: user.isAdmin
            }
        });


        const newUser = await prisma.user.findFirst({
            where: { email: newEmail }
        });
        if (!newUser) {
            console.error('[ DB ERROR ] Cannot update user, cannot retrieve new user');
            return { success: false, error: 'new user is a null value' };
        }


        console.log('[ DB SUCCESS ] updated user ' + newUser.email);
        return { success: true, data: newUser };
    }
    catch (err) {
        console.error('[ DB ERROR ] could not update user ' + err);
        return { success: false, error: err };
    }
}

async function findByEmail(email) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            console.error('[ DB ERROR ] Error at fetching');
            return { success: false, error: 'not exists' };
        }

        const newUser = {
            id: user.id,
            email: user.email,
            username: user.userName,
            role: user.role,
            isAdmin: user.isAdmin
        };
        console.log('[ AUTH SUCCESS ] Fetch succes on user:', newUser);
        return { success: true, data: newUser };
    }
    catch (err) {
        console.error('[ DB ERROR ] Error at fetching user:', err.message);
        return { success: false, error: err.message };
    }
}

module.exports = { createUser, loginUser, findByEmail, updateUser };