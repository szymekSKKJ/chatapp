import { app } from '../firebaseInitialize.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { collection, getDocs, doc, updateDoc, onSnapshot, getFirestore, getDoc, orderBy, limit, query, where } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import showAndHideComponent from '../showAndHideComponent.js';
import loadUserDataToSelectedContactComponent from './loadUserDataToSelectedContactComponent.js';
import displayGlobalNotification from '../displayGlobalNotification.js';
import prepareSending from './sendingMessage.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import loadFirstnameAndLastnameToMyProfileComponent from './loadDataToMyProfileComponent.js';
import ifMessageIncludesEmojiWithSymbols from './ifMessageIncludesEmojiWithSymbols.js';
import restoreDefault from "../restoreDefault.js";
import { loadNicknames } from "./changeNickname.js";
const ContactsComponent = document.querySelector('#Contacts');
const SelectedContactComponent = document.querySelector('#SelectedContact');
const friendsList = ContactsComponent.querySelector('#friends-list');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status');
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

const whenNewFriend = (isFriend, friendsListItem, lastMessage, uid, id, firstName, lastName, img, notificationNumber, lastMessageContent, checkIfUserIsLogged) => {
    if (isFriend === null) {
        const SelectedContactComponent = document.querySelector('#SelectedContact');
        const backButton = SelectedContactComponent.querySelector('#back-button');
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

                    lastMessageContent === undefined ? lastMessage.innerHTML = `<p>Powitaj nowego przyjaciela!</p>` : lastMessage.innerHTML = lastMessageContent;
                    
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
                        isFriend: true
                    });
                }
                checkIfUserIsLogged();
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

const loadFriendList = async(firstName, lastName, username, id, img, unreadMessagesNumber, lastMessageContent, isFriend, uid, checkIfUserIsLogged) => {
    if (isFriend || isFriend === null) {

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
        `;
        //<p id="friend-id" style="display: none;">${id}</p>
        //<p id="user-id" style="display: none;">${uid}</p>
        loadNicknames(id, friendName);

        const lastMessage = document.createElement('div');
        lastMessage.classList.add('message');
        wrapper.appendChild(lastMessage);
        if (isFriend) {
            getLastMessage(uid, id, lastMessage);
        }

        if (lastMessageContent === '') {
            lastMessage.classList.add('new-message');
            lastMessage.innerHTML = `<p>Powitaj nowego przyjaciela!</p>`;
        }

        const notificationNumber = document.createElement('div');
        notificationNumber.classList.add('notification-number');

        if (isFriend) {
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
        }

        whenNewFriend(isFriend, friendsListItem, lastMessage, uid, id, firstName, lastName, newLoadedImage, notificationNumber, lastMessageContent, checkIfUserIsLogged);
        if (isFriend) {
            listenNewMessages(uid, id, notificationNumber, lastMessage);
        }

        friendsListItem.addEventListener('click', async (event) => {
            if (isFriend) {
                const SelectedContactComponent = document.querySelector('#SelectedContact');
                showAndHideComponent(SelectedContactComponent, ContactsComponent);
                loadUserDataToSelectedContactComponent(event, firstName, lastName, newLoadedImage, lastMessage, uid, id);
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

let isLoadedListenIfNewFriendAddMe = false;
const listenIfNewFriendAddMe = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            const unsubscribeListenIfNewFriendAddMe = onSnapshot(query(collection(db, 'users', uid, 'friends')), (querySnapshot) => {
                if (isLoadedListenIfNewFriendAddMe) {
                    querySnapshot.forEach(async (doc) => {
                        const { firstName, lastName, username, id, img, unreadMessagesNumber, lastMessage, isFriend } = doc.data();
                        if (isFriend === null) {
                            friendsList.innerHTML = '';
                            const querySnapshot = await getDocs(collection(db, 'users', uid, 'friends'));
                            querySnapshot.forEach((doc) => {
                                const { firstName, lastName, username, id, img, unreadMessagesNumber, lastMessage, isFriend } = doc.data();
                                loadFriendList(firstName, lastName, username, id, img, unreadMessagesNumber, lastMessage, isFriend, uid, checkIfUserIsLogged);
                            });
                        }
                    });
                }
                isLoadedListenIfNewFriendAddMe = true;
            });

        } else {
            restoreDefault('force');
        }
    });
}

listenIfNewFriendAddMe();

const getUserFriendList = async (uid, checkIfUserIsLogged) => {
    const querySnapshot = await getDocs(collection(db, 'users', uid, 'friends'));
    querySnapshot.forEach((doc) => {
        const { firstName, lastName, username, id, img, unreadMessagesNumber, lastMessage, isFriend } = doc.data();
        loadFriendList(firstName, lastName, username, id, img, unreadMessagesNumber, lastMessage, isFriend, uid, checkIfUserIsLogged);
    });
    loadFirstnameAndLastnameToMyProfileComponent(uid);
    await updateDoc(doc(db, 'users', uid), {
        lastOnline: new Date()
    });
    globalLoading('hide');
}

const checkIfUserIsLogged = () => {
    const auth = getAuth();
    globalLoading('show');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            friendsList.innerHTML = '';
            const uid = user.uid;
            ifNotRememberMe();
            getUserFriendList(uid, checkIfUserIsLogged);
        } else {
            restoreDefault('force');
        }
    });
}
checkIfUserIsLogged();

export default checkIfUserIsLogged;