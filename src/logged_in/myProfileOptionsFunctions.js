import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js"
import displayOrHideGlobalLoading from "../displayOrHideGlobalLoading.js";
import restoreDefault from "../restoreDefault.js";
const MyProfileComponennt = document.querySelector('#MyProfile');
const options = MyProfileComponennt.querySelectorAll('.option');
const language = localStorage.getItem('language');

options.forEach((option) => {
    option.addEventListener('click', () => {
        if (option.className.includes('logout')) {
            restoreDefault('force');
        } else if (option.className.includes('fullscreen')) {
            document.documentElement.requestFullscreen();
        }
    });
});