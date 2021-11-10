import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js"
import displayGlobalNotification from '../displayGlobalNotification.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import submitByEnterKey from '../submitByEnterKey.js';
import authorizationSwitchError from '../authorizationSwitchError.js';
const RememberPassowrdFormComponent = document.querySelector('#RememberPassowrdForm');
const submitButton = RememberPassowrdFormComponent.querySelector('#submit-button');
const userEmail = RememberPassowrdFormComponent.querySelector('#user-email input');
const backButton = RememberPassowrdForm.querySelector('#back-button');
const inputsOnEnter = RememberPassowrdFormComponent.querySelectorAll('.input-on-enter');
const language = localStorage.getItem('language');

const isEmpty = (str) => {
    return !str.trim().length;
}

submitButton.addEventListener('click', () => {
    const auth = getAuth();
    globalLoading('show');
    if (!isEmpty(userEmail.value)) {
        sendPasswordResetEmail(auth, userEmail.value)
            .then(() => {
                backButton.click();
                globalLoading('hide');
                displayGlobalNotification('Password reset email sent', 'success');
                if (language === '_pl')
                    displayGlobalNotification('Instrukcja resetownia hasła została wysłana', 'success');
            })
            .catch((error) => {
                globalLoading('hide');
                displayGlobalNotification(authorizationSwitchError(error.code));
            });
    } else {
        displayGlobalNotification('Please fill en email');
        if (language === '_pl')
            displayGlobalNotification('Najpierw wypełnij email');
    }
});

submitByEnterKey(submitButton, inputsOnEnter);