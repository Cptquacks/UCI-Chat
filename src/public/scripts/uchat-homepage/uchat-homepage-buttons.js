/*
    - Homepage buttons functionallity
    - Just documented this for visual appliance

    It is autodocumented, wow, unironically, well donde Js
*/

document.addEventListener('DOMContentLoaded', () => {

    const [login_button, register_button] = document.querySelectorAll('[id="uchat-homepage-buttons"]');

    register_button.addEventListener('click', homepageRegister);
    login_button.addEventListener('click', homepageLogin);

});

async function homepageRegister() {
    fetch('/api/register', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => { window.location.href = res.url; });
}

async function homepageLogin() {
    fetch('/api/auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => { window.location.href = res.url; });
}
