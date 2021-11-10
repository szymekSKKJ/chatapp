import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js"
import { collection, getDocs, getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { app } from '../firebaseInitialize.js';
import displayGlobalNotification from '../displayGlobalNotification.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import submitByEnterKey from '../submitByEnterKey.js';
import authorizationSwitchError from '../authorizationSwitchError.js';
const SignupFormComponent = document.querySelector('#SignupForm');
const submitButton = SignupFormComponent.querySelector('#submit-button');
const inputs = SignupFormComponent.querySelectorAll('.input-placeholder input');
const userPassword = SignupForm.querySelector('#user-password input');
const userPasswordConfirm = SignupFormComponent.querySelector('#user-confirm-password input');
const privacyAndPolicy = SignupFormComponent.querySelector('#privacy-and-policy input');
const userEmail = SignupFormComponent.querySelector('#user-email input');
const userFirstName = SignupFormComponent.querySelector('#user-first-name input');
const userLastName = SignupFormComponent.querySelector('#user-last-name input');
const userLogin = SignupFormComponent.querySelector('#user-login input');
const signIn = SignupFormComponent.querySelector('#sign-in');
const inputsOnEnter = SignupFormComponent.querySelectorAll('.input-on-enter');
const language = localStorage.getItem('language');
const db = getFirestore(app);

submitButton.addEventListener('click', async() => {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            if (language === '_pl') {
                return displayGlobalNotification(`Najpierw podaj ${inputs[i].placeholder.toLowerCase()}`);
            } else {
                return displayGlobalNotification(`Please fill ${inputs[i].placeholder.toLowerCase()}`);
            }
        }
    }

    if (userPassword.value !== userPasswordConfirm.value) {
        if (language === '_pl') {
            return displayGlobalNotification('Hasło i powtórz hasło są różne');
        } else {
            return displayGlobalNotification('Password and confirm password are different');
        }

    }
    if (privacyAndPolicy.checked !== true) {
        if (language === '_pl') {
            return displayGlobalNotification('Zaznacz politykę prywatności');
        } else {
            return displayGlobalNotification('Please check privacy and policy');
        }

    }
    globalLoading('show');
    let isValidUsername = true;
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        if (doc.exists) {
            const { username } = doc.data();
            if (userLogin.value.toLowerCase() === username.toLowerCase()) isValidUsername = false;
        }
    });
    if (isValidUsername) {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, userEmail.value.trim(), userPassword.value.trim())
            .then((userCredential) => {
                if (userCredential) {
                    const uid = userCredential.user.uid;
                    updateProfile(auth.currentUser, {
                        displayName: `${userFirstName.value.trim()} ${userLastName.value.trim()} (${userLogin.value.trim()})`
                    }).then(async() => {
                        await setDoc(doc(db, "users", uid), {
                            id: uid,
                            firstName: userFirstName.value.trim(),
                            lastName: userLastName.value.trim(),
                            username: userLogin.value.trim(),
                            img: null,
                            verified: true,
                            lastOnline: new Date()
                        });
                        await setDoc(doc(db, "users", uid, 'friends', uid), {
                            id: uid,
                            firstName: userFirstName.value.trim(),
                            lastName: userLastName.value.trim(),
                            username: userLogin.value.trim(),
                            img: null,
                            unreadMessagesNumber: 0,
                            isFriend: true,
                            lastMessage: ''
                        });
                        signOut(auth).then(() => {
                            signIn.click();
                            globalLoading('hide');
                            displayGlobalNotification('Profile has been created', 'success');
                            if (language === '_pl')
                                displayGlobalNotification('Profil został utworzony', 'success');
                            inputs.forEach((input) => {
                                input.value = '';
                            });
                            privacyAndPolicy.checked = false;
                        }).catch((error) => {
                            displayGlobalNotification(authorizationSwitchError(error.code));
                            globalLoading('hide');
                        });
                    }).catch((error) => {
                        displayGlobalNotification(authorizationSwitchError(error.code));
                        globalLoading('hide');
                    });
                } else {
                    const auth = getAuth();
                    signOut(auth).then(() => {
                        localStorage.removeItem('email');
                        localStorage.removeItem('password');
                        localStorage.removeItem('rememberMe');
                        localStorage.setItem('error', 'Your session has been expired');
                        window.history.pushState("object or string", "Title", `/index.html?`);
                        window.location.reload(true);
                    }).catch((error) => {
                        // An error happened.
                    });
                }
            })
            .catch((error) => {
                displayGlobalNotification(authorizationSwitchError(error.code));
                globalLoading('hide');
            });
    } else {
        const errorMessage = 'Username is already taken';
        displayGlobalNotification(errorMessage);
        globalLoading('hide');
    }
});

submitByEnterKey(submitButton, inputsOnEnter);