/*
    Another autodocumentator?
*/

// eslint-disable-next-line no-unused-vars
const [tweaks_submit, close_submit] = document.querySelectorAll('#profile-button');
const [username_field, email_field, passsword_field, newpassword_field] = document.querySelectorAll('#profile-tweaks')

document.addEventListener('DOMContentLoaded', () => {


    close_submit.addEventListener('click', closeSession)
});

// eslint-disable-next-line no-unused-vars
async function saveSettings() {
    fetch('/api/update', {
        method: "POST",
        credentials: "include",

        body: JSON.stringify({
            newUser: username_field.value,
            newEmail: email_field.value,
            password: passsword_field.value,
            newPasssword: newpassword_field.value
        }),

        headers: {
            'Content-Type': 'application/json'
        }

    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert('Error al intentar actualizar los datos');
            };
        })
}

async function closeSession() {
    fetch('/api/logout', {
        method: "POST",
        credentials: "include",
        
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/';
            };
        })
}