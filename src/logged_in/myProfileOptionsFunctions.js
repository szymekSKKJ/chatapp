import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js"
import displayOrHideGlobalLoading from "../displayOrHideGlobalLoading.js";
const MyProfileComponennt = document.querySelector('#MyProfile');
const options = MyProfileComponennt.querySelectorAll('.option');
const language = localStorage.getItem('language');

options.forEach((option) => {
    option.addEventListener('click', () => {
        if (option.className.includes('logout')) {
            displayOrHideGlobalLoading('show');
            const auth = getAuth();
            signOut(auth).then(() => {
                const language = localStorage.getItem('language');
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                localStorage.removeItem('rememberMe');
                if (language === '_pl')
                    localStorage.setItem('error', 'Zostałeś wylogowany');
                localStorage.setItem('error', 'You have been log out');
                window.history.pushState("object or string", "Title", `../index/index${language === null ? '' : language}.html?`);
                window.location.reload(true);
            }).catch((error) => {
                // An error happened.
            });
        } else if (option.className.includes('fullscreen')) {
            document.documentElement.requestFullscreen();
        }
    });
});