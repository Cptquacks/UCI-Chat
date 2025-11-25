/*
    Another autodocumentator?
*/

/* global openModal */

const [tweaks_submit, close_submit] = document.querySelectorAll('#profile-button');
const [username_field, email_field, password_field, confirmation_field] = document.querySelectorAll('#profile-tweaks');

document.addEventListener('DOMContentLoaded', () => {


    close_submit.addEventListener('click', closeSession);
    tweaks_submit.addEventListener('click', saveSettings);
});


async function saveSettings() {
    if (password_field.value !== '' && password_field.value !== confirmation_field.value) {
        const modal_text = document.getElementById('default-err-text');
        modal_text.textContent = 'Las contraseñas deben coincidir para poder cambiarlas.';
        openModal();
        return;
    }

    fetch('/api/profile', {
        method: 'POST',
        credentials: 'include',

        body: JSON.stringify({
            newName: username_field.value,
            newEmail: email_field.value,
            newPassword: password_field.value
        }),

        headers: {
            'Content-Type': 'application/json'
        }

    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                const modal_text = document.getElementById('default-err-text');
                modal_text.textContent = 'Ha habido un error al actualizar los datos.';
                openModal();
                return;
            };
            const modal_text = document.getElementById('default-err-text');
            modal_text.textContent = 'Actualizacion de perfil exitosa.';
            openModal();
        });
}

async function closeSession() {
    fetch('/api/logout', {
        method: 'get',
        credentials: 'include',

        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/';
            };
        });
}