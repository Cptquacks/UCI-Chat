document.addEventListener('DOMContentLoaded', async () => {
    const [username, email, acctype] = document.querySelectorAll('#data');
    const [tweakUsername, tweakEmail, tweakPassword] = document.querySelectorAll('#profile-tweaks');
    const profile_info = await getProfile();

    username.textContent = profile_info.username;
    email.textContent = profile_info.email;
    acctype.textContent = (profile_info.role === 'STUDENT') ? 'Estudiante' : 'Profesor';

    tweakUsername.value = profile_info.username;
    tweakEmail.value = profile_info.email;
    tweakPassword.value = '';
});

async function getProfile() {
    const profile_Info = await fetch('/api/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

    return profile_Info.data;

}