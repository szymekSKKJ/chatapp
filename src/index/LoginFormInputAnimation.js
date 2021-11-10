const LoginFormComponent = document.querySelector('#LoginForm');
const inputsPlaceholder = LoginForm.querySelectorAll('.input-placeholder');

inputsPlaceholder.forEach((inputPlaceholder) => {
    const input = inputPlaceholder.querySelector('input');

    input.addEventListener('focus', () => {
        inputPlaceholder.style.transform = 'scale(1.025)';
    });

    input.addEventListener('blur', () => {
        inputPlaceholder.style.transform = 'scale(1)';
    });
});