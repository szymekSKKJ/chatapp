import { app } from '../firebaseInitialize.js';
import { doc, updateDoc, collection, getDocs, onSnapshot, getFirestore, orderBy, limit, query, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import ifMessageIncludesEmojiWithSymbols from './ifMessageIncludesEmojiWithSymbols.js';
import { writeFullContactName as writeFullContactNameInUserSettings } from './showSelectedContactSettingsComponent.js';
import { getFriendId } from './SelectedContactSettingsFunctions.js';
import displayGlobalErrorFullspace from '../displayGlobalErrorFullspace.js';
const SelectedContactComponent = document.querySelector('#SelectedContact');
const backButton = SelectedContactComponent.querySelector('#back-button');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status');
const ContactsComponent = document.querySelector('#Contacts');
const content = SelectedContactComponent.querySelector('#content');
const db = getFirestore(app);
let isHrYesterday = false;
let isHrOlder = false;

backButton.addEventListener('click', () => {
    content.style.scrollBehavior = 'auto';
    isHrYesterday = false;
    isHrOlder = false;
})

const addHrIfMessageIsOlderThenToday = (allMessagesSortedByDate) => {
    const reversedAllMessagesSortedByDate = allMessagesSortedByDate.reverse();
    const allMessages = content.children;
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const yesterdayMidnight = new Date(todayMidnight);
    yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
    yesterdayMidnight.setHours(0, 0, 0, 0);
    let isAlreadyExistYesterdayHr = false;
    let isAlreadyExistOlderHr = false;
    reversedAllMessagesSortedByDate.forEach((date, index) => {
        const { firebaseUnixTimestamp } = date;
        const toDateFirebaseUnixTimestamp = new Date(firebaseUnixTimestamp * 1000);
        const reversedIndex = reversedAllMessagesSortedByDate.length - index;
        const thisMessage = allMessages[reversedIndex];
        if (yesterdayMidnight > toDateFirebaseUnixTimestamp && isAlreadyExistOlderHr === false) {
            isAlreadyExistOlderHr = true;
            const hr = document.createElement('div');
            hr.classList.add('hr');
            hr.innerHTML = `
            <div class="line"></div>
            <p>older</p>
            <div class="line"></div>
        `;
            content.insertBefore(hr, thisMessage);
        }
        if (yesterdayMidnight < toDateFirebaseUnixTimestamp && toDateFirebaseUnixTimestamp < todayMidnight && isAlreadyExistYesterdayHr === false) {
            isAlreadyExistYesterdayHr = true;
            const hr = document.createElement('div');
            hr.classList.add('hr');
            hr.innerHTML = `
            <div class="line"></div>
            <p>Yesterday</p>
            <div class="line"></div>
        `;
            content.insertBefore(hr, thisMessage);
        }
    });
}

const convertedFirebaseUnixTimestampToDate = (firebaseUnixTimestamp) => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const toDateFirebaseUnixTimestamp = new Date(firebaseUnixTimestamp * 1000);
    const date = new Date(firebaseUnixTimestamp * 1000);
    const day = '0' + date.getDate();
    const month = '0' + (date.getMonth() + 1);
    const hours = '0' + date.getHours();
    const minutes = "0" + date.getMinutes();
    if (toDateFirebaseUnixTimestamp > todayMidnight) {
        const formattedTime = `Today ${hours.substr(-2)}:${minutes.substr(-2)}`;
        return formattedTime;
    } else {
        const yesterdayMidnight = new Date(todayMidnight);
        yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
        yesterdayMidnight.setHours(0, 0, 0, 0);
        if (toDateFirebaseUnixTimestamp < todayMidnight && toDateFirebaseUnixTimestamp > yesterdayMidnight) {
            const formattedTime = `Yesterday ${hours.substr(-2)}:${minutes.substr(-2)}`;
            return formattedTime;
        } else {
            const formattedTime = `${day.substr(-2)}/${month.substr(-2)} ${hours.substr(-2)}:${minutes.substr(-2)}`;
            return formattedTime;
        }
    }
}

const singleEmojiAnimation = (emoji) => {
    for (let i = 0; i < 31; i++) {
        const app = document.querySelector('#app');
        const emojiElement = document.createElement('div');
        emojiElement.innerHTML = `<img src="${emoji.src}">`;
        emojiElement.classList.add('single-emoji');
        emojiElement.style.display = 'block';
        app.appendChild(emojiElement);
        setTimeout(() => {
            emojiElement.remove();
        }, 6000);
    }
}

const ifMessageContentContainsOnlyEmoji = (messageContentElement, isNewMessage = false) => {
    const messageContent = messageContentElement.querySelector('p');
    setTimeout(() => {
        const isEveryImage = [...messageContent.childNodes].every((node) => node.tagName === 'IMG');
        if (isEveryImage) {
            messageContent.childNodes.forEach((node, index, array) => {
                if (array.length > 1) {
                    node.style.width = '36px';
                    node.style.height = '36px';
                } else {
                    node.style.width = '72px';
                    node.style.height = '72px';
                    if (isNewMessage) {
                        singleEmojiAnimation(node);
                    }
                }
            });
        }
    }, 10);
}

const addFriendProfileImageToMessage = (message, fromOrTo, imageUrl, index, array) => {
    if (array[index + 1]) {
        const { fromOrTo: nextFromOrToMessage } = array[index + 1];
        if (fromOrTo === 'message-from') {
            const profileImage = document.createElement('div');
            profileImage.classList.add('profile-image');
            if (nextFromOrToMessage !== 'message-from') {
                profileImage.innerHTML = `<img src="${imageUrl}">`;
                message.appendChild(profileImage);
            } else {
                profileImage.style.visibility = 'hidden';
                message.appendChild(profileImage);
            }
        }
    } else {
        if (fromOrTo === 'message-from') {
            if (message.previousSibling.className === 'message-from') {
                const previousProfileImageFromFriend = message.previousSibling.childNodes[0];
                previousProfileImageFromFriend.style.visibility = 'hidden';
                const profileImage = document.createElement('div');
                profileImage.classList.add('profile-image');
                profileImage.innerHTML = `<img src="${imageUrl}">`;
                profileImage.style.transform = `translateY(-${45}px)`;
                message.appendChild(profileImage);
                setTimeout(() => {
                    profileImage.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        profileImage.style.transform = 'translateY(0px)';
                    }, 200);
                }, 100);

            } else {
                const profileImage = document.createElement('div');
                profileImage.classList.add('profile-image');
                profileImage.innerHTML = `<img src="${imageUrl}">`;
                message.appendChild(profileImage);
            }
        }
    }
}

const createMessage = (fromOrTo, messageContent, firebaseUnixTimestamp, imageUrl, index, array, isNewMessage) => {
    const message = document.createElement('div');
    message.classList.add(`${fromOrTo}`);
    content.appendChild(message);
    const messageContentElement = document.createElement('div');
    messageContentElement.classList.add('message-content');
    messageContentElement.innerHTML = `
        <p>${messageContent}</p>
    `;

    addFriendProfileImageToMessage(message, fromOrTo, imageUrl, index, array);

    messageContentElement.addEventListener('click', () => {
        dateAndTime.style.animation = '';
        setTimeout(() => {
            dateAndTime.style.animation = 'showDateAndTime 5000ms ease-in-out forwards';
        }, 100)
        const removeAnimation = () => {
            dateAndTime.style.animation = '';
            dateAndTime.removeEventListener('animationend', removeAnimation);
        }
        dateAndTime.addEventListener('animationend', removeAnimation);
    });

    message.appendChild(messageContentElement);

    const dateAndTime = document.createElement('div');
    dateAndTime.classList.add('date-and-time');
    dateAndTime.innerHTML = `
        <p>${convertedFirebaseUnixTimestampToDate(firebaseUnixTimestamp)}</p>
    `;
    message.appendChild(dateAndTime);
    twemoji.parse(message);

    ifMessageIncludesEmojiWithSymbols(messageContent, messageContentElement);
    ifMessageContentContainsOnlyEmoji(messageContentElement, isNewMessage);
}

const clearUnreadMessages = async(uid, id) => {
    await updateDoc(doc(db, 'users', uid, 'friends', id), {
        unreadMessagesNumber: 0
    });
}

const listenIfFriendReadMessages = (uid, id, allMessagesSortedByDate, imageUrl) => {
    const lastReadMessageElement = document.createElement('div');
    lastReadMessageElement.classList.add('last-read-message');
    lastReadMessageElement.innerHTML = `
    <div class="message-from-image">
        <img src="${imageUrl}">
    </div>
    `;
    const unsubscribelistenIfFriendReadMessages = onSnapshot(doc(db, 'users', id, 'friends', uid), (doc) => {
        const { unreadMessagesNumber } = doc.data();
        for (let i = content.childNodes.length - 1; i >= 0; i--) {
            if (content.childNodes[i].className.includes('message-to')) {
                content.insertBefore(lastReadMessageElement, content.childNodes[(i + 1) - unreadMessagesNumber]);
                break;
            }
        }
        content.style.display = 'flex';
        content.scrollTop = content.scrollHeight;
        content.style.scrollBehavior = 'smooth';
        if (unreadMessagesNumber !== 0) {
            messagesStatus.innerHTML = '<p>Messages sent</p>';
        } else {
            messagesStatus.innerHTML = '<p>Messages seen</p>';
        }
    });
    backButton.addEventListener('click', () => {
        unsubscribelistenIfFriendReadMessages();
    });
}

const croppedMessageWhenScrolledUp = (imageUrl, messageContent) => {
    if ((content.scrollHeight - content.clientHeight) - content.scrollTop > 250) {
        const newMessage = document.createElement('div');
        newMessage.id = 'new-message';
        newMessage.innerHTML = `
            <img src="${imageUrl}">
            <p>${messageContent}</p>
        `;
        SelectedContactComponent.appendChild(newMessage);
        newMessage.style.display = 'flex';
        newMessage.addEventListener('click', () => {
            content.scrollTop = content.scrollHeight;
            newMessage.remove();
        });
        setTimeout(() => {
            newMessage.remove();
        }, 8000);
        backButton.addEventListener('click', () => {
            newMessage.remove();
        });
    } else {
        content.scrollTop = content.scrollHeight;
    }
}


const listenNewMessages = (lastMessageElement, uid, id, imageUrl, index, array) => {
    let isLoaded = false;
    const unsubscribeGetUserLastMessage = onSnapshot(query(collection(db, 'users', uid, 'friends', id, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(1)), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const { firebaseUnixTimestamp, messageContent } = doc.data();
            if (isLoaded) {
                lastMessageElement.innerHTML = `<p>${messageContent}</p>`;
                createMessage('message-to', messageContent, firebaseUnixTimestamp, imageUrl, index, array);
            }
        });
    });

    const unsubscribeGetFriendLastMessage = onSnapshot(query(collection(db, 'users', id, 'friends', uid, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(1)), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const { firebaseUnixTimestamp, messageContent } = doc.data();
            if (isLoaded) {
                lastMessageElement.innerHTML = `<p>${messageContent}</p>`;
                createMessage('message-from', messageContent, firebaseUnixTimestamp, imageUrl, index, array, true);
                setTimeout(() => {
                    clearUnreadMessages(uid, id);
                    const audio = new Audio('/assets/recive_message_pop.mp3');
                    audio.play();
                    croppedMessageWhenScrolledUp(imageUrl, messageContent);
                }, 500);
            }
        });
        isLoaded = true;
    });

    backButton.addEventListener('click', () => {
        unsubscribeGetUserLastMessage();
        unsubscribeGetFriendLastMessage();
    });
}

const loadAllMessages = async(allMessagesSortedByDate, lastMessageElement, uid, id, imageUrl) => {
    const querySnapshot = await getDocs(query(collection(db, 'users', uid, 'friends', id, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(50)));
    querySnapshot.forEach((doc) => {
        const { firebaseUnixTimestamp, messageContent } = doc.data();
        allMessagesSortedByDate.push({
            firebaseUnixTimestamp: firebaseUnixTimestamp,
            messageContent: messageContent,
            fromOrTo: 'message-to'
        });
    });
    const querySnapshot1 = await getDocs(query(collection(db, 'users', id, 'friends', uid, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(50)));
    querySnapshot1.forEach((doc) => {
        const { firebaseUnixTimestamp, messageContent } = doc.data();
        allMessagesSortedByDate.push({
            firebaseUnixTimestamp: firebaseUnixTimestamp,
            messageContent: messageContent,
            fromOrTo: 'message-from'
        });
    });
    allMessagesSortedByDate.sort(function(a, b) {
        return a.firebaseUnixTimestamp - b.firebaseUnixTimestamp;
    });
    allMessagesSortedByDate.forEach((message, index, array) => {
        const { firebaseUnixTimestamp, messageContent, fromOrTo } = message;
        createMessage(fromOrTo, messageContent, firebaseUnixTimestamp, imageUrl, index, array);
        if (index === array.length - 1) {
            addHrIfMessageIsOlderThenToday(allMessagesSortedByDate);
            listenNewMessages(lastMessageElement, uid, id, imageUrl, index, array);
        }
    });
    listenIfFriendReadMessages(uid, id, allMessagesSortedByDate, imageUrl);
}

const loadContactNameAndImage = (firstName, lastName, imageUrl) => {
    const contactName = SelectedContactComponent.querySelector('#contact-name');
    const contactImage = SelectedContactComponent.querySelector('#contact-image');
    contactName.innerHTML = `
    <p>${firstName}</p>
    `;
    contactImage.innerHTML = `
        <img src="${imageUrl}">
    `;
}

const writeUserStatus = async(uid, id) => {
    let automaticUpdateStatusInterval;
    const userStatus = SelectedContactComponent.querySelector('#upside #wrapper #wrapper1 #user-status p');
    const userActive = SelectedContactComponent.querySelector('#upside #wrapper #user-active');
    userStatus.innerHTML = ``;
    const unsubscribeListenUserStatus = onSnapshot(doc(db, 'users', id), (doc) => {
        clearInterval(automaticUpdateStatusInterval);
        const automaticUpdateStatus = () => {
            const { lastOnline } = doc.data();
            const now = new Date();
            const lastOnlineDate = new Date(lastOnline.seconds * 1000);
            const minutesNow = now.getMinutes();
            const minutesLastOnlineDate = lastOnlineDate.getMinutes();
            const hoursNow = now.getHours();
            const hoursLastOnlnieDate = lastOnlineDate.getHours()
            const daysNow = now.getDate();
            const daysLastOnlineDate = lastOnlineDate.getDate();
            if (daysNow === daysLastOnlineDate && minutesNow === minutesLastOnlineDate || minutesNow - minutesLastOnlineDate === 1) {
                userStatus.innerHTML = `Active now`;
                userActive.style.display = 'block';
            } else if (daysNow === daysLastOnlineDate && hoursNow === hoursLastOnlnieDate) {
                userStatus.innerHTML = `Last seen ${minutesNow - minutesLastOnlineDate} minutes ago`;
                userActive.style.display = 'none';
            } else if (daysNow === daysLastOnlineDate) {
                if ((60 - minutesLastOnlineDate) + minutesNow === 60) {
                    userStatus.innerHTML = `Last seen ${hoursNow - hoursLastOnlnieDate === 1 ? hoursNow - hoursLastOnlnieDate + ' hour' : hoursNow - hoursLastOnlnieDate + ' hours'} ago`;
                    userActive.style.display = 'none';
                } else if ((60 - minutesLastOnlineDate) + minutesNow > 60) {
                    userStatus.innerHTML = `Last seen ${hoursNow - hoursLastOnlnieDate === 1 ? hoursNow - hoursLastOnlnieDate + ' hour' : hoursNow - hoursLastOnlnieDate + ' hours'} ${Math.floor((((((60 - minutesLastOnlineDate) + minutesNow) / 60) - 1) * 60))} minutes ago`;
                    userActive.style.display = 'none';
                } else if (((60 - minutesLastOnlineDate) + minutesNow < 60)) {
                    userStatus.innerHTML = `Last seen ${(hoursNow - hoursLastOnlnieDate - 1) === 0 ? '' : hoursNow - hoursLastOnlnieDate - 1 === 1 ? hoursNow - hoursLastOnlnieDate - 1 + ' hour' : hoursNow - hoursLastOnlnieDate - 1 + ' hours' } ${(60 - minutesLastOnlineDate) + minutesNow} minutes ago`;
                    userActive.style.display = 'none';
                }
            } else {
                const nowMidnight = new Date(new Date().setHours(0, 0, 0, 0));
                const lastOnlineDateMidnight = new Date(new Date(lastOnline.seconds * 1000).setHours(0, 0, 0, 0)).getTime() / 1000;
                const yesterdayMidnight = new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() - 1)).getTime() / 1000;
                if (yesterdayMidnight === lastOnlineDateMidnight) {
                    userStatus.innerHTML = `Last seen yesterday at ${('0' + lastOnlineDate.getHours()).toString().slice(-2)}:${('0' + lastOnlineDate.getMinutes()).toString().slice(-2)}`;
                    userActive.style.display = 'none';
                } else {
                    userStatus.innerHTML = `Last seen ${('0' + (lastOnlineDate.getMonth() + 1)).toString().slice(-2)}.${ ('0' + lastOnlineDate.getDate()).toString().slice(-2)} at ${('0' + lastOnlineDate.getHours()).toString().slice(-2)}:${('0' + lastOnlineDate.getMinutes()).toString().slice(-2)}`;
                    userActive.style.display = 'none';
                }
            }
        }
        automaticUpdateStatus();
        automaticUpdateStatusInterval = setInterval(() => {
            automaticUpdateStatus();
        }, 1000);
    });

    backButton.addEventListener('click', () => {
        unsubscribeListenUserStatus();
        clearInterval(automaticUpdateStatusInterval);
    });
}

const checkIfFriendIsMyFriend = async (uid, id) => {
    const docSnap = await getDoc(doc(db, 'users', id, 'friends', uid));
    const { isFriend } = docSnap.data();
        if (isFriend === false || isFriend === null) {
            displayGlobalErrorFullspace(backButton, SelectedContactComponent, '403');
        }
        return isFriend;
    }

const loadUserDataToSelectedContactComponent = async (firstName, lastName, imageUrl, lastMessage, uid, id) => {
    if (await checkIfFriendIsMyFriend(uid, id) && await checkIfFriendIsMyFriend(uid, id) !== null) {
        const allMessagesSortedByDate = [];
        content.innerHTML = '';
        content.style.display = 'none';
        loadContactNameAndImage(firstName, lastName, imageUrl);
        loadAllMessages(allMessagesSortedByDate, lastMessage, uid, id, imageUrl);
        clearUnreadMessages(uid, id);
        writeUserStatus(uid, id);
        writeFullContactNameInUserSettings(firstName, lastName);
        getFriendId(id);
    }
}

export default loadUserDataToSelectedContactComponent;