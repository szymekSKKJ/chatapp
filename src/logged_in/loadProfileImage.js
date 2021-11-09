import { app } from '../firebaseInitialize.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";
import showAndHideComponent from '../showAndHideComponent.js';
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
const ContactsComponent = document.querySelector('#Contacts');
const profileImage = ContactsComponent.querySelector('#profile img');
const MyProfileOptionsComponent = document.querySelector('#MyProfileOptions');
const backButton = MyProfileOptionsComponent.querySelector('#back-button');
const language = localStorage.getItem('language');
const db = getFirestore(app);

const saveUrlInDB = async(uid, url) => {
    await updateDoc(doc(db, 'users', uid), {
        img: url
    });
}

const loadProfileImage = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            const storage = getStorage();
            getDownloadURL(ref(storage, `${uid}/profile_image.jpg`))
                .then((url) => {
                    saveUrlInDB(uid, url);
                    profileImage.src = url;
                    showAndHideComponent(ContactsComponent, MyProfileOptionsComponent);
                })
                .catch((error) => {
                    profileImage.src = './default_user.png';
                });
        } else {
            const auth = getAuth();
            signOut(auth).then(() => {
                const language = localStorage.getItem('language');
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                localStorage.removeItem('rememberMe');
                if (language === '_pl')
                    localStorage.setItem('error', 'Zostałeś wylogowany');
                localStorage.setItem('error', 'You have been log out');
                window.history.pushState("object or string", "Title", `../index/index.html?`);
                window.location.reload(true);
            }).catch((error) => {
                // An error happened.
            });
        }
    });
}

loadProfileImage();

export default loadProfileImage;