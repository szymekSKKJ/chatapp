import { app } from '../firebaseInitialize.js';
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import SelectedUserThemes from './selectedUserThemes.js';
const SelectedContactOptionElementsComponent = document.querySelector('#SelectedContactOptionElements');
const themesElement = SelectedContactOptionElementsComponent.querySelector('#change-theme #themes');
const SelectedContactComponent = document.querySelector('#SelectedContact');
const backButton = SelectedContactComponent.querySelector('#back-button');
const db = getFirestore(app);
let id;
let uid;
const getFriendId = (idd, uidd) => {
    id = idd;
    uid = uidd;
}

export { getFriendId }
const setTheme = async (theme, themeIndex) => {
    const { background: background_color, message: message_color, textarea: textarea_color, messageFromFont: messageFromColor } = theme;
    const SelectedContactComponent = document.querySelector('#SelectedContact');
    const messages = SelectedContactComponent.querySelectorAll('.message-from');
    const writeMessage = SelectedContactComponent.querySelector('#write-message textarea');
    const messageReplyelement = SelectedContactComponent.querySelector('#message-reply');
    const writeMessageElement = SelectedContactComponent.querySelector('#write-message');
    writeMessageElement.style.backgroundColor = background_color;
    messageReplyelement.style.backgroundColor = background_color;
    document.body.style.backgroundColor = background_color;
    writeMessage.style.backgroundColor = textarea_color;
    backButton.style.backgroundColor = message_color;
    messages.forEach((message) => {
        const messageContent = message.querySelector('.message-content');
        messageContent.style.backgroundColor = message_color;
        messageContent.style.color = messageFromColor;
    });

    await updateDoc(doc(db, 'users', uid, 'friends', id), {
        themeNumber: themeIndex
    });
}

const chooseThisTheme = (themeElement, theme, index) => {
    const themes = themesElement.querySelectorAll('.theme');
    themes.forEach((theme) => {
        if (theme.querySelector('i')) {
            const checkedIcon = theme.querySelector('i');
            checkedIcon.style.opacity = '0';
            setTimeout(() => {
                theme.innerHTML = '';
            }, 250);
        }
    });
    themeElement.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        const checkedIcon = themeElement.querySelector('i');;
        checkedIcon.style.opacity = '1';
        setTheme(theme, index);
    }, 10)
}

window.addEventListener('load', () => {
    SelectedUserThemes.forEach((theme, index) => {
        const { background, message, textarea, messageFrom } = theme;
        const themeElement = document.createElement('div');
        themeElement.style.backgroundImage = `radial-gradient(circle, ${background} , ${message} 50%)`;
        themeElement.classList.add('theme');
        themesElement.appendChild(themeElement);
        themeElement.addEventListener('click', () => {
            chooseThisTheme(themeElement, theme, index);
        });
    })
});