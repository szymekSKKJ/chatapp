import globalLoading from '../displayOrHideGlobalLoading.js';
window.addEventListener('load', () => {
    const rememberMeLocalStorage = localStorage.getItem('rememberMe');
    const LoginFormComponent = document.querySelector('#LoginForm');
    const submitButton = LoginFormComponent.querySelector('#submit-button');
    if (rememberMeLocalStorage) {
        submitButton.click();
    }
});