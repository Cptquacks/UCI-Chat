document.addEventListener('DOMContentLoaded', async () => {
    
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('on-clicked');
            setTimeout(() => this.classList.remove('on-clicked'), 500);
        })
    })
})