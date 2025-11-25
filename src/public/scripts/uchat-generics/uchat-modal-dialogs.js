

const modal_dialog = document.querySelector('.default-err-dialog');
const modal_close = document.getElementById('default-err-button');

document.addEventListener('DOMContentLoaded', () => {

    // Put this only to close a modal, wow javascript, love u
    modal_close.addEventListener('click', () => {
        if (!modal_close) {
            return;
        }

        modal_dialog.close();
    });
});

// eslint-disable-next-line no-unused-vars
function openModal() {
    modal_dialog.showModal();
}