import { app } from '../firebaseInitialize.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { collection, query, where, getDocs, getDoc, setDoc, getFirestore, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import submitByEnterKey from '../submitByEnterKey.js';
import displayGlobalNotification from '../displayGlobalNotification.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import restoreDefault from "../restoreDefault.js";
const AddFriendComponent = document.querySelector('#AddFriend');
const findUsername = AddFriendComponent.querySelector('#find-username input');
const inputsOnEnter = AddFriendComponent.querySelectorAll('.input-on-enter');
const submitButton = AddFriendComponent.querySelector('#submit-button');
const language = localStorage.getItem('language');
const backButton = AddFriendComponent.querySelector('#back-button');
const db = getFirestore(app);

const hasWhiteSpace = (username) => {
    return /\s/g.test(username);
}

submitButton.addEventListener('click', () => {
    const auth = getAuth();
    let counter = 0;
    globalLoading('show');
    onAuthStateChanged(auth, async(user) => {
        if (user) {
            const uid = user.uid;
            if (!hasWhiteSpace(findUsername.value)) {
                const querySnapshot = await getDocs(collection(db, 'users'));
                querySnapshot.forEach(async(doc1) => {
                    const { firstName, lastName, username, id, img } = doc1.data();
                    counter++;
                    if (findUsername.value.toLowerCase() === username.toLowerCase()) {
                        counter = 0;
                        if (uid !== id) {
                            const docSnap = await getDoc(doc(db, 'users', uid, 'friends', id));
                            if (docSnap.exists()) {
                                const { isFriend } = docSnap.data();
                                if (isFriend === false) {
                                    displayGlobalNotification('This user has blocked communication with you');
                                    if (language === '_pl')
                                        displayGlobalNotification('Ten użytkownik zablokował komunikację z Tobą');
                                    globalLoading('hide');
                                } else if (isFriend === true) {
                                    displayGlobalNotification('This user already is your friend');
                                    if (language === '_pl')
                                        displayGlobalNotification('Ten użytkownik jest już Twoim kontaktem')
                                    globalLoading('hide');
                                }
                            } else {
                                await setDoc(doc(db, 'users', uid, 'friends', id), {
                                    id: id,
                                    firstName: firstName,
                                    lastName: lastName,
                                    username: username,
                                    img: img,
                                    unreadMessagesNumber: 0,
                                    isFriend: true,
                                    lastMessage: ''
                                }); {
                                    const docSnap = await getDoc(doc(db, 'users', uid));
                                    const { firstName, lastName, username, img } = docSnap.data()
                                    await setDoc(doc(db, 'users', id, 'friends', uid), {
                                        id: uid,
                                        firstName: firstName,
                                        lastName: lastName,
                                        username: username,
                                        img: img,
                                        unreadMessagesNumber: 0,
                                        isFriend: null,
                                        lastMessage: ''
                                    });
                                }
                                displayGlobalNotification('User successful has been added', 'success');
                                if (language === '_pl')
                                    displayGlobalNotification('Użytkownik został dodany', 'success');
                                globalLoading('hide');
                                backButton.click();
                            }
                        } else {
                            displayGlobalNotification('You have already added yourself :)');
                            if (language === '_pl')
                                displayGlobalNotification('Już masz samego siebie dodanego :)');
                            globalLoading('hide');
                        }
                    } else if (querySnapshot.size === counter) {
                        displayGlobalNotification('User does not exists');
                        if (language === '_pl')
                            displayGlobalNotification('Użytkownik nie istnieje');
                        globalLoading('hide');
                    }
                });
            } else {
                displayGlobalNotification('Username contains space');
                if (language === '_pl')
                    displayGlobalNotification('Nazwa użytkownika nie moze być pusta');
                globalLoading('hide');
            }
        } else {
            restoreDefault('force');
        }
    });
});

submitByEnterKey(submitButton, inputsOnEnter);