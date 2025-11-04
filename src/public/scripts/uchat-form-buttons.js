document.addEventListener("DOMContentLoaded", () => {

    const userName_field = document.getElementById('username-field');
    const email_field = document.getElementById('email-field');

    const password_field = document.getElementById('password-field');
    const confirmation_field = document.getElementById('confirmation-field');

    const role_field = document.getElementById('role-field');

    const submit_login = document.getElementById('submit-login');
    const submit_register = document.getElementById('submit-register');

    submit_login.addEventListener('click', () => {
        if (!email_field || !password_field) {
            return;
        }
        submitLogin(email_field.value, password_field.value);
    })

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
                return;
            }

            window.location.href = '/';
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
                alert("Ha ocurrido un error al crear la cuenta!");
                return;
            }

            window.location.href = '/';
        });
}