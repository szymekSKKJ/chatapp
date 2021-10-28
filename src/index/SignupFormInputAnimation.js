const SignupFormComponent = document.querySelector('#SignupForm');
const inputsPlaceholder = SignupFormComponent.querySelectorAll('.input-placeholder');

inputsPlaceholder.forEach((inputPlaceholder) => {
    const input = inputPlaceholder.querySelector('input');
    
    input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.05)';
    });

    input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
    });
});


