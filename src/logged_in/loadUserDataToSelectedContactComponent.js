import { app } from '../firebaseInitialize.js';
import { doc, updateDoc, collection, getDocs, onSnapshot, getFirestore, orderBy, limit, query, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import ifMessageIncludesEmojiWithSymbols from './ifMessageIncludesEmojiWithSymbols.js';
import { writeFullContactName as writeFullContactNameInUserSettings } from './showSelectedContactOptionsComponent.js';
import { getFriendId as getFriendIdToSelectedContactOptionsFunctions } from './SelectedContactOptionsFunctions.js';
import { getFriendId as getFriendIdToswitchBetweenSelectedContactThemes } from './switchBetweenSelectedContactThemes.js'
import { getFriendId as getFriendIdToChangeNickname } from './changeNickname.js';
import { getIdOfReplayingDocument } from './sendingMessage.js';
import displayGlobalErrorFullspace from '../displayGlobalErrorFullspace.js';
import restoreDefault from "../restoreDefault.js";
import SelectedUserThemes from './selectedUserThemes.js';
const SelectedContactComponent = document.querySelector('#SelectedContact');
const backButton = SelectedContactComponent.querySelector('#back-button');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status');
const ContactsComponent = document.querySelector('#Contacts');
const content = SelectedContactComponent.querySelector('#content');
const db = getFirestore(app);
let isHrYesterday = false;
let isHrOlder = false;

backButton.addEventListener('click', () => {
    const { background: background_color, message: message_color, textarea: textarea_color } = SelectedUserThemes[0];
    content.style.scrollBehavior = 'auto';
    isHrYesterday = false;
    isHrOlder = false;
    document.body.style.backgroundColor = background_color;
});

const loadUserTheme = async (uid, id) => {
    const SelectedContactOptionElementsComponent = document.querySelector('#SelectedContactOptionElements');
    const messageReplyelement = SelectedContactComponent.querySelector('#message-reply');
    const messages = SelectedContactComponent.querySelectorAll('.message-from');
    const writeMessageElement = SelectedContactComponent.querySelector('#write-message');
    const writeMessage = SelectedContactComponent.querySelector('#write-message textarea');
    const themesElements = SelectedContactOptionElementsComponent.querySelectorAll('#change-theme #themes .theme');
    const docSnap = await getDoc(doc(db, 'users', uid, 'friends', id));
    const { themeNumber } = docSnap.data();
    if (themeNumber) {
        const { background: background_color, message: message_color, textarea: textarea_color, messageFromFont: messageFromColor } = SelectedUserThemes[themeNumber === undefined ? 0 : themeNumber];
        document.body.style.backgroundColor = background_color;
        writeMessage.style.backgroundColor = textarea_color;
        backButton.style.backgroundColor = message_color;
        messageReplyelement.style.backgroundColor = background_color;
        writeMessageElement.style.backgroundColor = background_color;
        messages.forEach((message) => {
            const messageContent = message.querySelector('.message-content');
            messageContent.style.backgroundColor = message_color;
            messageContent.style.color = messageFromColor;
        });
        themesElements[themeNumber].innerHTML = '<i class="fas fa-check" aria-hidden="true" style="opacity: 1;"></i>';
    }
}


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
        emojiElement.innerHTML = `<img src="${emoji.src}" draggable="false">`;
        emojiElement.classList.add('single-emoji');
        emojiElement.style.display = 'block';
        app.appendChild(emojiElement);
        setTimeout(() => {
            emojiElement.remove();
        }, 6000);
    }
}

const ifMessageContentContainsOnlyEmoji = (messageContentElement) => {
    let messageContent;
    if (messageContentElement.querySelector('.message-reply')) {
        messageContent = messageContentElement.querySelectorAll('p')[1];
    }
    else {
        messageContent = messageContentElement.querySelector('p');
    }
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
                }
            });
        }
    }, 10);
}

const ifLastMessageContainsOnlyOneEmoji = () => {
    const allMessages = [...SelectedContactComponent.querySelector('#content').childNodes];
    if (allMessages.length > 0) {
        const lastMessage = allMessages[allMessages.length - 1];
        if (lastMessage.querySelector('.message-content p')) {
            let lastMessageContent
            if (lastMessage.querySelector('.message-content .message-reply')) {
                lastMessageContent = lastMessage.querySelectorAll('.message-content p')[1];
            }
            else {
                lastMessageContent = lastMessage.querySelector('.message-content p');
            }
            if (lastMessageContent.childNodes.length === 1 && lastMessageContent.childNodes[0].tagName === 'IMG') {
                singleEmojiAnimation(lastMessageContent.childNodes[0]);
            }
        }
    }
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


const replyMessage = (messageElement, fromOrTo, messageContentElement, messageContent, idOfDocument, allMessagesSortedByDate) => {
    if (fromOrTo === 'message-from') {
        const messageReplyElement = SelectedContactComponent.querySelector('#message-reply');
        const messageReplyToNameElement = SelectedContactComponent.querySelector('#message-reply #reply-to-name p');
        const messageReplyContent = SelectedContactComponent.querySelector('#message-reply #message-reply-content p');
        const friendName = SelectedContactComponent.querySelector('#upside #wrapper #wrapper1 #contact-name p').innerHTML;
        let isPressing = false;
        let mouseDownXposition;
        let isSelectedMessage = false;
    
        messageElement.addEventListener('mousedown', (event) => {
            isPressing = true;
            mouseDownXposition = event.clientX;
        });

        messageElement.addEventListener('touchstart', (event) => {
            isPressing = true;
            mouseDownXposition = event.touches[0].pageX;
        });
    
        window.addEventListener('mouseup', (event) => {
            isPressing = false;
            isSelectedMessage = false;
            messageContentElement.animate([
                { 
                    marginLeft: ''
                },
                { 
                    marginLeft: '0px'
                }
              ], {
                duration: 250,
                iterations: 1,
                fill: 'forwards',
                easing: 'ease-in-out',
              });
        });

        window.addEventListener('touchend', (event) => {
            isPressing = false;
            isSelectedMessage = false;
            messageContentElement.animate([
                { 
                    marginLeft: ''
                },
                { 
                    marginLeft: '0px'
                }
              ], {
                duration: 250,
                iterations: 1,
                fill: 'forwards',
                easing: 'ease-in-out',
              });
        });
    
        window.addEventListener('mousemove', (event) => {
            if (isPressing) {
                messageContentElement.animate([
                    { 
                        marginLeft: ''
                    },
                    { 
                        marginLeft: `${(event.clientX - mouseDownXposition)}px`
                    }
                  ], {
                    duration: 1,
                    iterations: 1,
                    fill: 'forwards',
                    easing: 'ease-in-out',
                  });
                if (event.clientX - mouseDownXposition > 75 && isSelectedMessage === false) {
                    getIdOfReplayingDocument(idOfDocument);
                    isSelectedMessage = true;
                    messageReplyElement.style.display = 'flex';
                    setTimeout(() => {
                        messageReplyElement.style.transform = 'translateY(115px)';
                       setTimeout(() => {
                        messageReplyElement.style.transform = 'translateY(0px)';
                       }, 333);
                    }, 100);
                    setTimeout(() => {
                        messageReplyContent.innerHTML = messageContent;
                        messageReplyToNameElement.innerHTML = `Reply to ${friendName}`;
                    }, 433);
                }
                else {
                    
                }
            }
        });

        window.addEventListener('touchmove', (event) => {
            if (isPressing) {
                messageContentElement.animate([
                    { 
                        marginLeft: ''
                    },
                    { 
                        marginLeft: `${(event.touches[0].pageX - mouseDownXposition)}px`
                    }
                  ], {
                    duration: 1,
                    iterations: 1,
                    fill: 'forwards',
                    easing: 'ease-in-out',
                  });
                if (event.touches[0].pageX - mouseDownXposition > 75 && isSelectedMessage === false) {
                    getIdOfReplayingDocument(idOfDocument);
                    isSelectedMessage = true;
                    messageReplyElement.style.display = 'flex';
                    setTimeout(() => {
                        messageReplyElement.style.transform = 'translateY(115px)';
                       setTimeout(() => {
                        messageReplyElement.style.transform = 'translateY(0px)';
                       }, 333);
                    }, 100);
                    setTimeout(() => {
                        messageReplyContent.innerHTML = messageContent;
                        messageReplyToNameElement.innerHTML = `Reply to ${friendName}`;
                    }, 433);
                }
                else {
                    
                }
            }
        });
    }
}

const ifIsReplyMessage = async (idOfReplayingDocument, allMessagesSortedByDate, messageContentElement, messageContent, idOfDocument, uid, id, fromOrTo) => {
    if (idOfReplayingDocument) {
        const docSnap = fromOrTo === 'message-from' ? await getDoc(doc(db, 'users', uid, 'friends', id, 'deliveredMessages', idOfReplayingDocument)) : await getDoc(doc(db, 'users', id, 'friends', uid, 'deliveredMessages', idOfReplayingDocument));
        const { messageContent : replyingMessageContent } = docSnap.data();

        messageContentElement.innerHTML = `
        <div class="message-reply">
            <p>${replyingMessageContent}</p>
        </div>
        <p>${messageContent}</p>
        `;
        content.scrollTop = content.scrollHeight;
        const messageReplyElement = messageContentElement.querySelector('.message-reply');
        messageReplyElement.addEventListener('click', () => {
            const messageReplyElementContent = messageReplyElement.querySelector('p');
            const messagesTo = SelectedContactComponent.querySelectorAll('.message-to');
            
            messagesTo.forEach((messageTo) => {
                const messageToContent = messageTo.querySelector('.message-content > p');
                
                if (messageReplyElementContent.innerHTML === messageToContent.innerHTML) {
                    messageTo.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                    setTimeout(() => {
                        messageTo.style.backgroundColor = '#4188be';
                        messageToContent.parentElement.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            messageTo.style.transition = 'all 500ms';
                            messageTo.style.backgroundColor = 'transparent';
                            messageToContent.parentElement.style.transform = 'scale(1)';
                            setTimeout(() => {
                                messageTo.style.transition = 'all 250ms';
                            }, 500);
                        }, 250);
                    }, 100);
                }
            });
        });
        
    }
}

const createMessage = (fromOrTo, messageContent, firebaseUnixTimestamp, imageUrl, index, array, idOfDocument, allMessagesSortedByDate, idOfReplayingDocument, uid, id) => {
    const message = document.createElement('div');
    message.classList.add(`${fromOrTo}`);
    content.appendChild(message);
    const messageContentElement = document.createElement('div');
    messageContentElement.classList.add('message-content');
    messageContentElement.innerHTML = `
        <p>${messageContent}</p>
    `;

    
    ifIsReplyMessage(idOfReplayingDocument, allMessagesSortedByDate, messageContentElement, messageContent, idOfDocument, uid, id, fromOrTo);
    replyMessage(message, fromOrTo, messageContentElement, messageContent, idOfDocument, allMessagesSortedByDate);

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
    ifMessageContentContainsOnlyEmoji(messageContentElement);
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

const listenNewMessages = (lastMessageElement, uid, id, imageUrl, index, array, idOfDocument, allMessagesSortedByDate, idOfReplayingDocument) => {
    let isLoaded = false;
    const unsubscribeGetUserLastMessage = onSnapshot(query(collection(db, 'users', uid, 'friends', id, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(1)), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const { firebaseUnixTimestamp, messageContent, idOfReplayingDocument} = doc.data();
            if (isLoaded) {
                const idOfDocument = doc.id;
                lastMessageElement.innerHTML = `<p>${messageContent}</p>`;
                createMessage('message-to', messageContent, firebaseUnixTimestamp, imageUrl, index, array, idOfDocument, allMessagesSortedByDate, idOfReplayingDocument, uid, id);
                ifLastMessageContainsOnlyOneEmoji();
            }
        });
    });

    const unsubscribeGetFriendLastMessage = onSnapshot(query(collection(db, 'users', id, 'friends', uid, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(1)), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const { firebaseUnixTimestamp, messageContent, idOfReplayingDocument } = doc.data();
            if (isLoaded) {
                const idOfDocument = doc.id;
                lastMessageElement.innerHTML = `<p>${messageContent}</p>`;
                createMessage('message-from', messageContent, firebaseUnixTimestamp, imageUrl, index, array, idOfDocument, allMessagesSortedByDate, idOfReplayingDocument, uid, id);
                setTimeout(() => {
                    clearUnreadMessages(uid, id);
                    const audio = new Audio('/assets/recive_message_pop.mp3');
                    audio.play();
                    croppedMessageWhenScrolledUp(imageUrl, messageContent);
                    ifLastMessageContainsOnlyOneEmoji();
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
        const { firebaseUnixTimestamp, messageContent, idOfReplayingDocument } = doc.data();
        allMessagesSortedByDate.push({
            id: doc.id,
            firebaseUnixTimestamp: firebaseUnixTimestamp,
            messageContent: messageContent,
            fromOrTo: 'message-to',
            idOfReplayingDocument: idOfReplayingDocument
        });
    });
    const querySnapshot1 = await getDocs(query(collection(db, 'users', id, 'friends', uid, 'deliveredMessages'), orderBy('firebaseUnixTimestamp', 'desc'), limit(50)));
    querySnapshot1.forEach((doc) => {
        const { firebaseUnixTimestamp, messageContent, idOfReplayingDocument } = doc.data();
        allMessagesSortedByDate.push({
            id: doc.id,
            firebaseUnixTimestamp: firebaseUnixTimestamp,
            messageContent: messageContent,
            fromOrTo: 'message-from',
            idOfReplayingDocument: idOfReplayingDocument
        });
    });
    allMessagesSortedByDate.sort(function(a, b) {
        return a.firebaseUnixTimestamp - b.firebaseUnixTimestamp;
    });
    allMessagesSortedByDate.forEach((message, index, array) => {
        const { firebaseUnixTimestamp, messageContent, fromOrTo, id : idOfDocument, idOfReplayingDocument } = message;
        createMessage(fromOrTo, messageContent, firebaseUnixTimestamp, imageUrl, index, array, idOfDocument, allMessagesSortedByDate, idOfReplayingDocument, uid, id);
        if (index === array.length - 1) {
            addHrIfMessageIsOlderThenToday(allMessagesSortedByDate);
            listenNewMessages(lastMessageElement, uid, id, imageUrl, index, array, idOfDocument, allMessagesSortedByDate, idOfReplayingDocument);
        }
    });
    
    listenIfFriendReadMessages(uid, id, allMessagesSortedByDate, imageUrl);
    ifLastMessageContainsOnlyOneEmoji();
    loadUserTheme(uid, id);
}

const loadContactNameAndImage = (firstName, lastName, imageUrl, id) => {
    const contactName = SelectedContactComponent.querySelector('#contact-name');
    const contactImage = SelectedContactComponent.querySelector('#contact-image');
    contactImage.innerHTML = `
        <img src="${imageUrl}">
    `;
    if (localStorage.getItem(id)) {
        contactName.innerHTML = `<p>${localStorage.getItem(id)}</p>`;
    }
    else {
        contactName.innerHTML = `
        <p>${firstName}</p>
        `;
    }
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
            if (daysNow === daysLastOnlineDate && hoursNow === hoursLastOnlnieDate && (minutesNow === minutesLastOnlineDate || minutesNow - minutesLastOnlineDate === 1)) {
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

//co jakiś czas to niech mi sprawdza

const checkIfFriendIsMyFriend = async (uid, id, content) => {
    const docSnap = await getDoc(doc(db, 'users', id, 'friends', uid));
    const { isFriend } = docSnap.data();
    if (isFriend === false) {
        displayGlobalErrorFullspace(backButton, SelectedContactComponent, '403');
    }
    listenIfFriendBlockMe(uid, id, content);
    return isFriend;
}

const listenIfFriendBlockMe = (uid, id) => {
    const unsubscribeListenIfFriendBlockMe = onSnapshot(doc(db, 'users', id, 'friends', uid), (doc) => {
        const { isFriend } = doc.data();
        if (isFriend === false) {
            content.innerHTML = '';
            content.style.display = 'none';
            displayGlobalErrorFullspace(backButton, SelectedContactComponent, '403');
            unsubscribeListenIfFriendBlockMe();
        }
    });
    backButton.addEventListener('click', () => {
        unsubscribeListenIfFriendBlockMe();
    });
}

const loadChangeNicknameInputValue = (id) => {
    const SelectedContactOptionElementsComponent = document.querySelector('#SelectedContactOptionElements');
    const changeNicknameInput = SelectedContactOptionElementsComponent.querySelector('#change-nickname #input input');
    const getNicknameById = localStorage.getItem(id);
    changeNicknameInput.value = getNicknameById;
}

const loadUserDataToSelectedContactComponent = async (event, firstName, lastName, imageUrl, lastMessage, uid, id) => {
    content.innerHTML = '';
    content.style.display = 'none';
    const isFriend = await checkIfFriendIsMyFriend(uid, id, content);
    if (isFriend === true || isFriend === null) {
        const allMessagesSortedByDate = [];
        loadContactNameAndImage(firstName, lastName, imageUrl, id);
        loadAllMessages(allMessagesSortedByDate, lastMessage, uid, id, imageUrl);
        clearUnreadMessages(uid, id);
        writeUserStatus(uid, id);
        writeFullContactNameInUserSettings(firstName, lastName);
        getFriendIdToSelectedContactOptionsFunctions(id);
        getFriendIdToswitchBetweenSelectedContactThemes(id, uid);
        getFriendIdToChangeNickname(event, id);
        loadChangeNicknameInputValue(id);
    }
}

export default loadUserDataToSelectedContactComponent;