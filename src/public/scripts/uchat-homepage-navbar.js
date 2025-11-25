document.addEventListener('DOMContentLoaded', () => {
    const homepage_navbar = document.querySelector('.uchat-nav-bar');
    const homepage_body = document.querySelector('.uchat-homepage-body');

    homepage_body.style.paddingTop = `${homepage_navbar.offsetHeight}px`;
});