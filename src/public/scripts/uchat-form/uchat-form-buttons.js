const err_text = document.getElementById('default-err-text');

document.addEventListener('DOMContentLoaded', () => {

    /*
        Get fields
        Auto declarative
    */
    const userName_field = document.getElementById('username-field');
    const email_field = document.getElementById('email-field');

    const password_field = document.getElementById('password-field');
    const confirmation_field = document.getElementById('confirmation-field');

    const role_field = document.getElementById('role-field');


    /*
        Finally the submit buttons
    */
    const submit_login = document.getElementById('submit-login') || null;
    const submit_register = document.getElementById('submit-register') || null;


    if (submit_login) {

        submit_login.addEventListener('click', () => {
            if (!email_field || !password_field) {
                err_text.textContent = 'Todos los campos son requeridos.';

                // eslint-disable-next-line no-undef
                openModal();
                return;
            }

            submitLogin(email_field.value, password_field.value);

        });

    }

    if (submit_register) {

        submit_register.addEventListener('click', () => {
            if (userName_field === '' || email_field === '') {
                err_text.textContent = 'Los campos de usuario son requeridos.';

                // eslint-disable-next-line no-undef
                openModal();
                return;
            }

            if (password_field === '' || confirmation_field === '') {
                err_text.textContent = 'Los campos de credenciales son requeridos.';

                // eslint-disable-next-line no-undef
                openModal();
                return;
            }


            // Finally evaluate if password in the confirmation and password fields are equals
            if (password_field.value !== confirmation_field.value) {
                err_text.textContent = 'Las contraseñas deben coincidir.';

                // eslint-disable-next-line no-undef
                openModal();
                return;
            }

            submitRegister(userName_field.value, email_field.value, password_field.value, role_field.value);
        });

    }
});



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
                    shown_message = 'Error desconocido';

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
                const error_message = data.error;
                let shown_message = '';

                if (error_message.includes('bad email'))
                    shown_message = 'El email introducido no es valido';

                else if (error_message.includes('alredy exists'))
                    shown_message = 'Ya existe un usuario con esta direccion de';

                else
                    shown_message = 'Error desconocido';

                err_text.textContent = shown_message;
                return;
            }

            window.location.href = '/chat/index';
        });
}