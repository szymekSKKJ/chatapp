import { app } from '../firebaseInitialize.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { collection, getDocs, doc, updateDoc, onSnapshot, getFirestore, getDoc, orderBy, limit, query } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import showAndHideComponent from '../showAndHideComponent.js';
import loadUserDataToSelectedContactComponent from './loadUserDataToSelectedContactComponent.js';
import displayGlobalNotification from '../displayGlobalNotification.js';
import prepareSending from './sendingMessage.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import loadFirstnameAndLastnameToMyProfileComponent from './loadDataToMyProfileComponent.js';
import ifMessageIncludesEmojiWithSymbols from './ifMessageIncludesEmojiWithSymbols.js';
const ContactsComponent = document.querySelector('#Contacts');
const SelectedContactComponent = document.querySelector('#SelectedContact');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status');
const language = localStorage.getItem('language');
const db = getFirestore(app);

const writeLastMessage = (lastMessage, bothMessages) => {
    bothMessages.sort(function(a, b) {
        return a.firebaseUnixTimestamp - b.firebaseUnixTimestamp;
    });
    lastMessage.innerHTML = `<p>${bothMessages[1].messageContent}</p>`;
    ifMessageIncludesEmojiWithSymbols(bothMessages[1].messageContent, lastMessage);
}

const getLastMessage = async(uid, id, lastMessage) => {
    const bothMessages = [];
    const querySnapshot = await getDocs(query(collection(db, 'users', uid, 'friends', id, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(1)));
    querySnapshot.forEach(async(doc) => {
        const { firebaseUnixTimestamp, messageContent } = doc.data();
        bothMessages.push({
            firebaseUnixTimestamp: firebaseUnixTimestamp,
            messageContent: messageContent
        });
        const querySnapshot = await getDocs(query(collection(db, 'users', id, 'friends', uid, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(1)));
        querySnapshot.forEach((doc) => {
            const { firebaseUnixTimestamp, messageContent } = doc.data();
            bothMessages.push({
                firebaseUnixTimestamp: firebaseUnixTimestamp,
                messageContent: messageContent
            });
            writeLastMessage(lastMessage, bothMessages)
        });
    });
}

const listenNewMessages = (uid, id, notificationNumber, lastMessage) => {
    onSnapshot(doc(db, 'users', uid, 'friends', id), (doc) => {
        const { lastMessage: lastMessageContent, unreadMessagesNumber } = doc.data();
        notificationNumber.style.display = 'none';
        setTimeout(() => {
            if (unreadMessagesNumber !== 0) {
                notificationNumber.innerHTML = `<p>${unreadMessagesNumber}</p>`;
                lastMessage.innerHTML = `<p>${lastMessageContent}</p>`;
                notificationNumber.style.display = 'block';
                notificationNumber.innerHTML = `<p>${unreadMessagesNumber}</p>`;
                lastMessage.classList.add('new-message');
                ifMessageIncludesEmojiWithSymbols(lastMessageContent, lastMessage);
            } else {
                notificationNumber.style.display = 'none';
                notificationNumber.innerHTML = `<p></p>`;
                lastMessage.classList.remove('new-message');
            }
        }, 50);
    });
}

const whenNewFriend = (isFriend, friendsListItem, lastMessage, uid, id, firstName, lastName, img, notificationNumber) => {
    if (isFriend === null) {
        const acceptOrIgnoreFriend = document.createElement('div');
        acceptOrIgnoreFriend.classList.add('accept-or-ignore-friend');
        acceptOrIgnoreFriend.innerHTML = `
            <div class="button">
                <i class="fad fa-check-square"></i>
            </div>
            <div class="button">
                <i class="fad fa-times-square"></i>
            </div>
        `;
        friendsListItem.appendChild(acceptOrIgnoreFriend);

        lastMessage.innerHTML = `
            <p>Nowy kontakt!</p>
        `;
        lastMessage.classList.add('new-message');

        const acceprOrIgnoreFriendButtons = acceptOrIgnoreFriend.querySelectorAll('.button');
        acceprOrIgnoreFriendButtons.forEach((button, index) => {
            button.addEventListener('click', async() => {
                if (index === 0) {
                    await updateDoc(doc(db, 'users', uid, 'friends', id), {
                        isFriend: true
                    });
                    friendsListItem.removeChild(acceptOrIgnoreFriend);
                    lastMessage.innerHTML = `
                      <p>Powitaj nowego przyjaciela!</p>
                      `;
                    friendsListItem.addEventListener('click', () => {
                        const SelectedContactComponent = document.querySelector('#SelectedContact');
                        showAndHideComponent(SelectedContactComponent, ContactsComponent);
                        loadUserDataToSelectedContactComponent(firstName, lastName, img, lastMessage, uid, id);
                        prepareSending(uid, id);
                    });
                    await updateDoc(doc(db, 'users', id, 'friends', uid), {
                        isFriend: true
                    });
                    listenNewMessages(uid, id, notificationNumber, lastMessage);

                } else {
                    await updateDoc(doc(db, 'users', uid, 'friends', id), {
                        isFriend: false
                    });
                    friendsListItem.style.display = 'none';
                    await updateDoc(doc(db, 'users', id, 'friends', uid), {
                        isFriend: false
                    });
                }
            });
        });
    }
}

const checkIfUserChangedProfileImage = async(id, LastImg, friendImageElement, uid) => {
    const docSnap = await getDoc(doc(db, 'users', id));
    const { img } = docSnap.data();
    if (LastImg === img && img !== null) {
        friendImageElement.innerHTML = `<img src="${img}">`;
        return img;
    } else if (img === null) {
        friendImageElement.innerHTML = `<img src="default_user.png">`;
        return 'default_user.png';
    } else {
        await updateDoc(doc(db, 'users', uid, 'friends', id), {
            img: img
        });
        friendImageElement.innerHTML = `<img src="${img}">`;
        return img;
    }
}

const loadFriendList = async(firstName, lastName, username, id, img, unreadMessagesNumber, lastMessageContent, isFriend, uid) => {
    if (isFriend || isFriend === null) {
        const friendsList = ContactsComponent.querySelector('#friends-list');

        const friendsListItem = document.createElement('div');
        friendsListItem.classList.add('friends-list-item');
        friendsList.appendChild(friendsListItem);

        const friendImage = document.createElement('div');
        friendImage.classList.add('image');
        friendsListItem.appendChild(friendImage);
        const newLoadedImage = await checkIfUserChangedProfileImage(id, img, friendImage, uid);
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        friendsListItem.appendChild(wrapper);

        const friendName = document.createElement('div');
        friendName.classList.add('name');
        wrapper.appendChild(friendName);

        friendName.innerHTML = `
            <p>${firstName}</p>
            <p>${lastName}</p>
            <p id="friend-id" style="display: none;">${id}</p>
            <p id="user-id" style="display: none;">${uid}</p>
        `;

        const lastMessage = document.createElement('div');
        lastMessage.classList.add('message');
        wrapper.appendChild(lastMessage);
        getLastMessage(uid, id, lastMessage);

        if (lastMessageContent === '') {
            lastMessage.classList.add('new-message');
            lastMessage.innerHTML = `<p>Powitaj nowego przyjaciela!</p>`;
        }


        const notificationNumber = document.createElement('div');
        notificationNumber.classList.add('notification-number');
        friendsListItem.appendChild(notificationNumber);

        if (unreadMessagesNumber !== 0) {
            notificationNumber.style.display = 'block';
            notificationNumber.innerHTML = `<p>${unreadMessagesNumber}</p>`;
            lastMessage.classList.add('new-message');
        } else {
            notificationNumber.style.display = 'none';
            notificationNumber.innerHTML = `<p></p>`;
            lastMessage.classList.remove('new-message');
        }

        whenNewFriend(isFriend, friendsListItem, lastMessage, uid, id, firstName, lastName, newLoadedImage, notificationNumber);

        if (isFriend) {
            listenNewMessages(uid, id, notificationNumber, lastMessage);
        }

        friendsListItem.addEventListener('click', async() => {
            if (isFriend) {
                const SelectedContactComponent = document.querySelector('#SelectedContact');
                showAndHideComponent(SelectedContactComponent, ContactsComponent);
                loadUserDataToSelectedContactComponent(firstName, lastName, newLoadedImage, lastMessage, uid, id);
                prepareSending(uid, id);
                await updateDoc(doc(db, 'users', uid), {
                    lastOnline: new Date()
                });
            }
        });
    }
}

const ifNotRememberMe = () => {
    const rememberMe = localStorage.getItem('rememberMe');
    if (!rememberMe) {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
    }
}

const getUserFriendList = async(uid) => {
    const querySnapshot = await getDocs(collection(db, 'users', uid, 'friends'));
    querySnapshot.forEach((doc) => {
        const { firstName, lastName, username, id, img, unreadMessagesNumber, lastMessage, isFriend } = doc.data();
        loadFriendList(firstName, lastName, username, id, img, unreadMessagesNumber, lastMessage, isFriend, uid);
    });
    loadFirstnameAndLastnameToMyProfileComponent();
    globalLoading('hide');
}

const checkIfUserIsLogged = () => {
    const auth = getAuth();
    globalLoading('show');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const friendsList = ContactsComponent.querySelector('#friends-list');
            friendsList.innerHTML = '';
            const uid = user.uid;
            ifNotRememberMe();
            getUserFriendList(uid);
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
                window.history.pushState("object or string", "Title", `../index/index${language}.html?`);
                window.location.reload(true);
            }).catch((error) => {
                // An error happened.
            });
        }
    });
}
checkIfUserIsLogged();

export default checkIfUserIsLogged;