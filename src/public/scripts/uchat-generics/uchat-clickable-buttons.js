/*
    Love u JS i had to write this script only for adding animations to a button
*/

document.addEventListener('DOMContentLoaded', async () => {
    
    document.querySelectorAll('button').forEach(button => { // This is a lambda func for every button in the same page

        button.addEventListener('click', function() {

            this.classList.add('on-clicked'); //on-clicked is an animation declared at /styles/button-styles.css
            setTimeout(() => this.classList.remove('on-clicked'), 300);

        })

    })


})