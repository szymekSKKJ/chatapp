import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import globalLoading from './displayOrHideGlobalLoading.js';

const restoreDefault = (force = false) => {
    globalLoading('show');
    localStorage.removeItem('email');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('password');
    localStorage.setItem('error', 'You have been logout');
    if (force === 'force') {
        const auth = getAuth();
        signOut(auth).then(() => {
            globalLoading('hide');
            window.history.pushState("object or string", "Title", `/`);
            window.location.reload(true);
        }).catch((error) => {
            globalLoading('hide');
            window.history.pushState("object or string", "Title", `/`);
            window.location.reload(true);
        });
    }
    globalLoading('hide');
}

export default restoreDefault;

//import restoreDefault from "../restoreDefault.js";