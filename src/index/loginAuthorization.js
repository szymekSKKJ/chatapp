import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js"
import displayGlobalNotification from '../displayGlobalNotification.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import submitByEnterKey from '../submitByEnterKey.js';
import authorizationSwitchError from '../authorizationSwitchError.js';
const LoginFormComponent = document.querySelector('#LoginForm');
const userLogin = LoginFormComponent.querySelector('#user-login input');
const userPassword = LoginFormComponent.querySelector('#user-password input');
const submitButton = LoginFormComponent.querySelector('#submit-button');
const rememberMe = LoginFormComponent.querySelector('#remember-me input');
const inputs = LoginFormComponent.querySelectorAll('.input-placeholder input');
const inputsOnEnter = LoginFormComponent.querySelectorAll('.input-on-enter');
const language = localStorage.getItem('language');

const isEmpty = (str) => {
    return !str.trim().length;
}

window.addEventListener('load', () => {
    const errorMessage = localStorage.getItem('error');
    if (errorMessage !== null) {
        displayGlobalNotification(errorMessage);
        localStorage.removeItem('error');
    }
});

submitButton.addEventListener('click', () => {
    const auth = getAuth();
    const rememberMeLocalStorage = localStorage.getItem('rememberMe');
    globalLoading('show');
    if (rememberMeLocalStorage) {
        userLogin.value = localStorage.getItem('email');
        userPassword.value = localStorage.getItem('password');
    }
    if (!isEmpty(userLogin.value) && !isEmpty(userPassword.value)) {
        signInWithEmailAndPassword(auth, userLogin.value.trim(), userPassword.value)
            .then((userCredential) => {
                if (rememberMe.checked === true) {
                    localStorage.setItem('rememberMe', 'true');
                }
                localStorage.setItem('email', userLogin.value.trim());
                localStorage.setItem('password', userPassword.value);
                window.history.pushState("object or string", "Title", `/src/logged_in/logged_in${language === null ? '' : language}.html?`);
                window.location.reload(true);
                globalLoading('hide');
            })
            .catch((error) => {
                displayGlobalNotification(authorizationSwitchError(error.code));
                globalLoading('hide');
            });
    } else {
        displayGlobalNotification('Please fill login and password');
        if (language === '_pl')
            displayGlobalNotification('Najpierw wypełnij login i hasło');
        globalLoading('hide');
    }

});

submitByEnterKey(submitButton, inputsOnEnter);