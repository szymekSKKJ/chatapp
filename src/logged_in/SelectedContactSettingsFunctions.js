import { app } from '../firebaseInitialize.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import checkIfUserIsLogged from './loadFriendsList.js';
import displayGlobalPopoutMessage from '../displayGlobalPopoutMessage.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
const SelectedContactSettingsComponent = document.querySelector('#SelectedContactSettings');
const options = SelectedContactSettingsComponent.querySelectorAll('.option');
const SelectedContactComponent = document.querySelector('#SelectedContact');
const backButton = SelectedContactComponent.querySelector('#upside #back-button');
const closeSettingsButton = SelectedContactSettingsComponent.querySelector('#close-button');
const db = getFirestore(app);
let id;

const getFriendId = (idd) => {
    id = idd;
}

const blockThisUser = (id) => {
    globalLoading('show');
    const auth = getAuth();
    onAuthStateChanged(auth, async(user) => {
        if (user) {
            const uid = user.uid;
            await updateDoc(doc(db, 'users', uid, 'friends', id), {
                isFriend: false
            });
            backButton.click();
            closeSettingsButton.click();
            checkIfUserIsLogged();
        } else {
            // User is signed out
        }
    });
}

options.forEach((option) => {
    option.addEventListener('click', () => {
        if (option.id === 'block-this-user') {
            const contactName = SelectedContactSettingsComponent.querySelector('#contact-name p');
            displayGlobalPopoutMessage(`Are you sure you want to block ${contactName.innerHTML} ?`, () => blockThisUser(id));
        }
    });
});

export { getFriendId };