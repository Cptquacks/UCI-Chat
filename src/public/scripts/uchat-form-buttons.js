/* 
    TODO:
    - Comment this file
*/

const err_text = document.getElementById('default-err-text');

document.addEventListener("DOMContentLoaded", () => {

    const userName_field = document.getElementById('username-field');
    const email_field = document.getElementById('email-field');

    const password_field = document.getElementById('password-field');
    const confirmation_field = document.getElementById('confirmation-field');

    const role_field = document.getElementById('role-field');

    const submit_login = document.getElementById('submit-login') || null;
    const submit_register = document.getElementById('submit-register') || null;


    if (!submit_login) {
        return;
    }
    submit_login.addEventListener('click', () => {
        if (!email_field || !password_field) {
            return;
        }
        submitLogin(email_field.value, password_field.value);
    })


    if (!submit_register) {
        return;
    }
    submit_register.addEventListener('click', () => {
        if (!userName_field || !email_field || !password_field || !confirmation_field || !role_field) {
            return;
        }

        if (password_field.value !== confirmation_field.value) {
            alert("Las contraseñas deben coincidir");
            return;
        }

        submitRegister(userName_field.value, email_field.value, password_field.value, role_field.value);
    })
})

async function submitLogin(email, password) {

    if (!email || !password) {
        return;
    }

    fetch('/api/login', {
        method: 'POST',

        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                const error_message = data.error;
                let shown_message = '';

                if (error_message.includes('bad email')) 
                    shown_message = 'El email introducido no es valido';
                
                else if (error_message.includes('bad credentials')) 
                    shown_message = 'La contraseña introducida no es correcta';

                else 
                    shown_message = 'Error desconocido'

                err_text.textContent = shown_message;

                // eslint-disable-next-line no-undef
                openModal();
                return;
            }

            window.location.href = '/chat/index';
        });

}

async function submitRegister(username, email, password, role) {
    if (!username || !email || !password || !role) {
        return;
    }

    fetch('/api/register', {
        method: 'POST',

        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            role: role
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert("Ha ocurrido un error al crear la cuenta!\n" + data.error);
                return;
            }

            window.location.href = '/chat/index';
        });
}