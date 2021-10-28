import { app } from '../firebaseInitialize.js';
import { getFirestore, Timestamp, getDoc, setDoc, doc, addDoc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import submitByEnterKey from '../submitByEnterKey.js'
import displayGlobalNotification from '../displayGlobalNotification.js';
const SelectedContactComponent = document.querySelector('#SelectedContact');
const ContactsComponent = document.querySelector('#Contacts');
const content = SelectedContactComponent.querySelector('#content');
const writeMessageWrapper = SelectedContactComponent.querySelector('#write-message');
const writeMessage = SelectedContactComponent.querySelector('#write-message textarea');
const sendButton = SelectedContactComponent.querySelector('#write-message #send-button');
const inputsOnEnter = SelectedContactComponent.querySelectorAll('.input-on-enter');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status');
const db = getFirestore(app);
let uid;
let id;

const prepareSending = (uidd, idd) => {
    uid = uidd;
    id = idd;
}
writeMessage.addEventListener('focus', () => {
    setTimeout(() => {
        content.scrollTop = content.scrollHeight;
    }, 500);
});
const isEmpty = (writeMessage) => {
    return !writeMessage.trim().length;
};

sendButton.addEventListener('click', async() => {
    const firebaseUnixTimestamp = firebase.firestore.Timestamp.now().seconds;
    if (!isEmpty(writeMessage.value)) {
        writeMessageWrapper.removeAttribute(id);
        writeMessageWrapper.setAttribute("id", "write-message-forbid");
        writeMessage.blur();
        writeMessage.focus();
        await addDoc(collection(db, 'users', uid, 'friends', id, 'deliveredMessages'), {
            messageContent: writeMessage.value,
            firebaseUnixTimestamp: firebaseUnixTimestamp
        });
        const docSnap = await getDoc(doc(db, 'users', id, 'friends', uid));
        const { unreadMessagesNumber } = docSnap.data();
        await updateDoc(doc(db, 'users', id, 'friends', uid), {
            lastMessage: writeMessage.value,
            unreadMessagesNumber: unreadMessagesNumber + 1
        });
        await updateDoc(doc(db, 'users', uid), {
            lastOnline: new Date()
        });
        writeMessageWrapper.removeAttribute(id);
        writeMessageWrapper.setAttribute("id", "write-message");
        writeMessage.value = writeMessage.defaultValue;
        writeMessage.style.height = "36px";
        content.scrollTop = content.scrollHeight;
        content.style.height = `calc(100vh - 120px)`;
        messagesStatus.style.bottom = `55px`;
        const audio = new Audio('/assets/send_message_pop.mp3');
        audio.play();
    }
});

submitByEnterKey(sendButton, inputsOnEnter);


export default prepareSending;