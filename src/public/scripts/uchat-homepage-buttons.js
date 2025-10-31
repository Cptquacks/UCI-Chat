/*
    - Homepage buttons functionallity
    - Just documented this for visual appliance

*/
document.addEventListener('DOMContentLoaded', () => {

    const [login_button, register_button] = document.querySelectorAll('[id="uchat-homepage-buttons"]');

    register_button.addEventListener('click', homepageRegister);
    login_button.addEventListener('click', homepageLogin);

})

async function homepageRegister() {
    const request = await fetch('/api/register', {
        method: "GET"
    });

    if (!request) {
        return;
    }

    window.location.href = request.url;
}

async function homepageLogin() {
    const request = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });


    if (!request) {
        return;
    }

    window.location.href = request.url;
}
