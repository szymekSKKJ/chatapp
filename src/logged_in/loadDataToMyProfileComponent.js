import { app } from '../firebaseInitialize.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
const MyProfileComponent = document.querySelector('#MyProfile');
const language = localStorage.getItem('language');
const db = getFirestore(app);

//LoadMyDataAfterLoadFriendsList

const loadFirstnameAndLastnameToMyProfileComponent = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async(user) => {
        if (user) {
            const uid = user.uid;
            const docSnap = await getDoc(doc(db, 'users', uid));
            const { firstName, lastName } = docSnap.data()
            const nameAndLastname = MyProfileComponent.querySelector('#name-and-lastname p');
            nameAndLastname.innerHTML = `${firstName} ${lastName}`;
        } else {
            const auth = getAuth();
            signOut(auth).then(() => {
                const language = localStorage.getItem('language');
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                localStorage.removeItem('rememberMe');
                if (language === '_pl')
                    ocalStorage.setItem('error', 'Zostałeś wylogowany');
                localStorage.setItem('error', 'You have been log out');
                window.history.pushState("object or string", "Title", `../index/index${language}.html?`);
                window.location.reload(true);
            }).catch((error) => {
                // An error happened.
            });
        }
    });
}

export default loadFirstnameAndLastnameToMyProfileComponent;