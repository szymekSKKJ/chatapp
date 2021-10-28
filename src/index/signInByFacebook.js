import { getAuth, signInWithRedirect, getRedirectResult, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js"
const LoginFormComponent = document.querySelector('#LoginForm');
const loginWithFacebook = LoginFormComponent.querySelector('#login-with-facebook');

loginWithFacebook.addEventListener('click', () => {
    console.log('www');
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    getRedirectResult(auth)
        .then((result) => {
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            console.log(result)
            const user = result.user;
        }).catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;

            const email = error.email;

            const credential = FacebookAuthProvider.credentialFromError(error);

        });
});