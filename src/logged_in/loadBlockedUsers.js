import { app } from '../firebaseInitialize.js';
import { collection, getDocs, getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import addShowPopoutMessageOnClick from './blockedUsersFunctions.js';
const MyProfileComponent = document.querySelector('#MyProfile');
const blockedUsersOption = MyProfileComponent.querySelector('#blocked-users-option');
const MyProfileOptionsComponent = document.querySelector('#MyProfileOptions');
const blockedUsers = MyProfileOptionsComponent.querySelector('#blocked-users-list');
const db = getFirestore(app);

const ifUserChooseYes = async(uid, id) => {
    await updateDoc(doc(db, 'users', uid, 'friends', id), {
        isFriend: true
    });
    await updateDoc(doc(db, 'users', id, 'friends', uid), {
        isFriend: null
    });
}

blockedUsersOption.addEventListener('click', async() => {
    let counter = 0;
    const auth = getAuth();
    onAuthStateChanged(auth, async(user) => {
        if (user) {
            const uid = user.uid;
            const querySnapshot = await getDocs(collection(db, 'users', uid, 'friends'));
            querySnapshot.forEach((doc) => {
                const { firstName, lastName, isFriend, img, id } = doc.data();
                if (isFriend === false) {
                    if (counter === 0) {
                        blockedUsers.innerHTML = '';
                    }
                    const blockedUser = document.createElement('div');
                    blockedUser.classList.add('blocked-user');
                    blockedUser.innerHTML = `
                    <div class="image">
                        <img src="${img === null ? 'default_user.png' : img}">
                    </div>
                    <div class="name">
                        <p>${firstName}</p>
                        <p>${lastName}</p>
                    </div>
                   `;
                    blockedUsers.appendChild(blockedUser);
                    addShowPopoutMessageOnClick(blockedUser, () => ifUserChooseYes(uid, id));
                    counter++;
                }
            });
        } else {
            // User is signed out
            // ...
        }
    });
});