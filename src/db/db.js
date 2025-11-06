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

async function updateUser(userData) {
    try {
        if (!userData) {
            console.error('[ DB ERROR ] could not update user, userdata empty');
            return { success: false, error: 'could not update user' };
        }

        if (!validateEmail(userData.newEmail)) {
            console.error('[ DB ERROR ] could not update user, email invalid ' + userData.newEmail);
            return { success: false, error: 'could not update user' };
        }



        const user = await prisma.user.findFirst({
            where: {
                email: userData.email
            }
        });

        if (!user) {
            console.error('[ DB ERROR ] No user could be found');
            return { success: false, error: 'could not update user' };
        }

        const comparePasswords = await encode.compare(userData.password, user.password);

        if (!comparePasswords) {
            console.error('[ DB ERROR ] Could not check password');
            return { success: false, error: 'could not update user' };
        }

        const { newUser, newEmail, newPassword } = userData;

        const encryptedPassword = newPassword ? await encode.hash(newPassword, 12) : null;

        console.log('[ DB LOG ] Trying to update user');

        const newData = await prisma.user.update({
            where: {
                email: userData.email
            },
            data: {
                userName: newUser || user.userName,
                email: newEmail || user.email,
                password: encryptedPassword || user.password
            },
            select: {
                id: true,
                email: true,
                userName: true,
                role: true,
                isAdmin: true
            }
        });

        console.log('[ DB SUCCESS ] User updated!');
        return { success: true, data: newData };

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