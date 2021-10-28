import displayGlobalNotification from '../displayGlobalNotification.js';
const MyProfileOptionsComponent = document.querySelector('#MyProfileOptions');
const changeLanguage = MyProfileOptionsComponent.querySelector('#change-language');
const changeLanguageIcons = changeLanguage.querySelectorAll('.icon');
const backButton = changeLanguage.querySelector('#back-button');
const submitButton = changeLanguage.querySelector('#submit-button');
const language = localStorage.getItem('language');
let lastPickedIconIndex = 0;

changeLanguageIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        changeLanguageIcons[lastPickedIconIndex].classList.remove('picked');
        icon.classList.add('picked');
        lastPickedIconIndex = index;
    });
});

submitButton.addEventListener('click', () => {
    changeLanguageIcons.forEach((icon) => {
        if (icon.className.includes('picked')) {
            const languageDataset = icon.dataset.language;
            if (language === languageDataset) {
                displayGlobalNotification('This language is already chosen');
                if (language === '_pl')
                    displayGlobalNotification('Ten język jest już wybrany');
            } else {
                localStorage.setItem('language', languageDataset);
                displayGlobalNotification('Language has been changed', 'success');
                if (language === '_pl')
                    displayGlobalNotification('Język został zmieniony', 'success');
                backButton.click();
                setTimeout(() => {
                    window.history.pushState("object or string", "Title", `/src/logged_in/logged_in${languageDataset}.html?`);
                    window.location.reload(true);
                }, 1000);
            }

        }
    });
});