const LoginFormComponent = document.querySelector('#LoginForm');
const changeLanguage = LoginFormComponent.querySelector('#change-language');
const changeLanguageIcons = changeLanguage.querySelectorAll('.icon');

changeLanguageIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
        const language = icon.dataset.language;
        localStorage.setItem('language', language);
        window.history.pushState("object or string", "Title", `/src/logged_in/logged_in.html?`);
        window.location.reload(true);
    });
});