import { app } from '../firebaseInitialize.js';
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
const SelectedContactComponent = document.querySelector('#SelectedContact');
const content = SelectedContactComponent.querySelector('#content');
const backButton = SelectedContactComponent.querySelector('#upside #back-button');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status p');
let allMessagesWithContents = [];
const db = getFirestore(app);

const addZero = (number) => {
    if (number < 10) {
        number = `0${number}`;
    }
    return number;
}

const convertDateToTimestamp = (timestamps) => {
    timestamps.sort((a, b) => {
        return a.date - b.date;
    })
    return timestamps;
}

const firstMessageWithUser = () => {

}

const createMessageElement = (messageContent, fromOrTo, sendTime) => {
    const message = document.createElement('div');
    message.classList.add(`message-${fromOrTo}`)
    content.appendChild(message);
    if (messageContent === '')
        message.style.display = 'none';
    message.innerHTML = `
    <div class="message-content">
        <p>${messageContent}</p>
    </div>
    <div class="read">
        <p>${sendTime}</p>
    </div>
    `;

    const sendTimeElement = message.querySelector('.read');
    message.addEventListener('click', () => {
        sendTimeElement.style.animation = '';
        setTimeout(() => {
            sendTimeElement.style.animation = 'showDate 5000ms forwards ease-in-out';
        }, 200);
        sendTimeElement.addEventListener('animationend', () => {
            sendTimeElement.style.animation = '';
        });
    });
}

const loadAllMessages = (lastMessageElementInContactsComponent) => {
    content.innerHTML = '';

    const clearUnreadMessages = () => {
        const selectedUserId = SelectedContactComponent.querySelector('#user-id').innerHTML;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;
                db.collection('users').doc(uid).collection('friends').doc(selectedUserId).update({
                        unreadMessages: 0
                    })
                    .then(() => {

                    })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });;
            } else {
                const errorMessage = 'Your session has expired';
                localStorage.setItem('error', `${errorMessage}`);
                window.history.pushState("object or string", "Title", `/index.html?`);
                window.location.reload(true);
            }
        });
    }

    clearUnreadMessages();

    //const whenUserIsActiveClearMessages = setInterval(() => {
    //clearUnreadMessages();
    //}, 1000);

    //const clearwhenUserIsActiveClearMessagesInterval = () => {
    //clearInterval(whenUserIsActiveClearMessages);
    //backButton.removeEventListener('click', clearwhenUserIsActiveClearMessagesInterval);
    //}

    //backButton.addEventListener('click', clearwhenUserIsActiveClearMessagesInterval);

    const ifUserReadMessages = () => {
        firebase.auth().onAuthStateChanged((user) => {
            const uid = user.uid;
            const selectedUserId = SelectedContactComponent.querySelector('#user-id').innerHTML;
            if (user) {
                const seenMessagesDbUnsubscribe = db.collection('users').doc(selectedUserId).collection('friends').doc(uid)
                    .onSnapshot((doc) => {
                        const { unreadMessages } = doc.data();
                        if (unreadMessages === 0) {
                            messagesStatus.innerHTML = 'Messages seen';
                        } else {
                            messagesStatus.innerHTML = 'Messages sent';
                        }
                    });

                const clearFunctions = () => {
                    seenMessagesDbUnsubscribe();
                    backButton.removeEventListener('click', clearFunctions);
                }

                backButton.addEventListener('click', clearFunctions);
            } else {
                const errorMessage = 'Your session has expired';
                localStorage.setItem('error', `${errorMessage}`);
                window.history.pushState("object or string", "Title", `/index.html?`);
                window.location.reload(true);
            }
        })
    }

    ifUserReadMessages();

    const automaticUpdateMessages = () => {
        let uidDbLoadedOnce = false;
        let fDbLoadedOnce = false;
        const selectedUserId = SelectedContactComponent.querySelector('#user-id').innerHTML;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;

                const uidDbUnsubscribe = db.collection("users").doc(uid).collection('friends').doc(selectedUserId).collection('deliveredMessages')
                    .onSnapshot((doc) => {
                        db.collection("users").doc(uid).collection('friends').doc(selectedUserId).collection('deliveredMessages').orderBy("date", "desc").limit(1).get()
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    const { content, date } = doc.data();
                                    const createDate = new Date(date.seconds * 1000);
                                    const day = createDate.getDate()
                                    const month = createDate.getMonth()
                                    const year = createDate.getFullYear();
                                    const hour = createDate.getHours();
                                    const minute = createDate.getMinutes();
                                    const second = createDate.getSeconds();
                                    const newDate = `${addZero(day)}.${addZero(month)}.${addZero(year)} ${addZero(hour)}:${addZero(minute)}`;
                                    if (uidDbLoadedOnce || allMessagesWithContents.length === 0 || (allMessagesWithContents.length > 0 && fDbLoadedOnce))
                                        createMessageElement(content, 'to', newDate);
                                    setTimeout(() => {
                                        window.scrollTo(0, document.body.scrollHeight);
                                    }, 100);

                                    //We have sent message then display it at ContactComponent in default style
                                    lastMessageElementInContactsComponent.style.fontWeight = '300';
                                    lastMessageElementInContactsComponent.style.letterSpacing = '0px';
                                    lastMessageElementInContactsComponent.style.color = '#b6bec8';
                                    //lastMessageElementInContactsComponent.innerHTML = `<p>${content}</p>`;
                                    uidDbLoadedOnce = true;
                                });
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    });

                const fDbUnsubscribe = db.collection("users").doc(selectedUserId).collection('friends').doc(uid).collection('deliveredMessages')
                    .onSnapshot((doc) => {
                        db.collection("users").doc(selectedUserId).collection('friends').doc(uid).collection('deliveredMessages').orderBy("date", "desc").limit(1).get()
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    const { content, date } = doc.data();
                                    const createDate = new Date(date.seconds * 1000);
                                    const day = createDate.getDate()
                                    const month = createDate.getMonth()
                                    const year = createDate.getFullYear();
                                    const hour = createDate.getHours();
                                    const minute = createDate.getMinutes();
                                    const second = createDate.getSeconds();
                                    const newDate = `${addZero(day)}.${addZero(month)}.${addZero(year)} ${addZero(hour)}:${addZero(minute)}`;
                                    if (fDbLoadedOnce || allMessagesWithContents.length === 0)
                                        createMessageElement(content, 'from', newDate);
                                    setTimeout(() => {
                                        window.scrollTo(0, document.body.scrollHeight);
                                    }, 100);
                                    //lastMessageElementInContactsComponent.innerHTML = `<p>${content}</p>`;
                                    clearUnreadMessages();
                                    fDbLoadedOnce = true;
                                });
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    });

                const clearFunctions = () => {
                    uidDbUnsubscribe();
                    fDbUnsubscribe();
                    allMessagesWithContents = [];
                    backButton.removeEventListener('click', clearFunctions);
                }

                backButton.addEventListener('click', clearFunctions);
            } else {
                const errorMessage = 'Your session has expired';
                localStorage.setItem('error', `${errorMessage}`);
                window.history.pushState("object or string", "Title", `/index.html?`);
                window.location.reload(true);
            }
        });
    }

    const loadDeliveredMessages = () => {
        const selectedUserId = SelectedContactComponent.querySelector('#user-id').innerHTML;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;
                db.collection("users").doc(uid).collection('friends').doc(selectedUserId).collection('deliveredMessages').orderBy('date', 'desc').limit(20).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const { content, date } = doc.data();
                            allMessagesWithContents.push({
                                content: content,
                                date: new Date(date.seconds * 1000),
                                fromOrTo: 'to'
                            });
                        });
                    })
                    .then(() => {
                        automaticUpdateMessages();
                        const convertedTimeStamps = convertDateToTimestamp(allMessagesWithContents);
                        convertedTimeStamps.forEach((timestamp) => {
                            const { content, fromOrTo, date } = timestamp;
                            const day = date.getDate()
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();
                            const hour = date.getHours();
                            const minute = date.getMinutes();
                            const second = date.getSeconds();
                            const newDate = `${addZero(day)}.${addZero(month)}.${addZero(year)} ${addZero(hour)}:${addZero(minute)}`;
                            createMessageElement(content, fromOrTo, newDate);
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            } else {
                const errorMessage = 'Your session has expired';
                localStorage.setItem('error', `${errorMessage}`);
                window.history.pushState("object or string", "Title", `/index.html?`);
                window.location.reload(true);
            }
        });
    }

    const loadReceivedMessages = () => {
        const selectedUserId = SelectedContactComponent.querySelector('#user-id').innerHTML;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;
                db.collection("users").doc(selectedUserId).collection('friends').get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const { id: docId } = doc.data();
                        if (docId === uid) {
                            db.collection("users").doc(selectedUserId).collection('friends').doc(docId).collection('deliveredMessages').orderBy('date', 'desc').limit(20).get().then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        const { content, date } = doc.data();
                                        allMessagesWithContents.push({
                                            content: content,
                                            date: new Date(date.seconds * 1000),
                                            fromOrTo: 'from'
                                        });
                                    });
                                })
                                .then(() => {
                                    loadDeliveredMessages();
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                    });
                });
            } else {
                const errorMessage = 'Your session has expired';
                localStorage.setItem('error', `${errorMessage}`);
                window.history.pushState("object or string", "Title", `/index.html?`);
                window.location.reload(true);
            }
        });
    }
    loadReceivedMessages();
}

export default loadAllMessages;