import { app } from '../firebaseInitialize.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
const MyProfileComponent = document.querySelector('#MyProfile');
const language = localStorage.getItem('language');
const db = getFirestore(app);

//LoadMyDataAfterLoadFriendsList

const loadFirstnameAndLastnameToMyProfileComponent = async (uid) => {
    const docSnap = await getDoc(doc(db, 'users', uid));
    const { firstName, lastName } = docSnap.data()
    const nameAndLastname = MyProfileComponent.querySelector('#name-and-lastname p');
    nameAndLastname.innerHTML = `${firstName} ${lastName}`;
}

export default loadFirstnameAndLastnameToMyProfileComponent;