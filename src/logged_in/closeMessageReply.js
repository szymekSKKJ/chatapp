import { getIdOfReplayingDocument } from './sendingMessage.js';
const SelectedContactComponent = document.querySelector('#SelectedContact');
const messageReplyElement = SelectedContactComponent.querySelector('#message-reply');
const messageReplyCloseButton = SelectedContactComponent.querySelector('#message-reply #close-button');
const messageReplyContent = SelectedContactComponent.querySelector('#message-reply #message-reply-content p');
const messageReplyToNameElement = SelectedContactComponent.querySelector('#message-reply #reply-to-name p');
const sendButton = SelectedContactComponent.querySelector('#write-message #send-button');

messageReplyCloseButton.addEventListener('click', () => {
    messageReplyElement.style.transform = 'translateY(115px)';
    messageReplyContent.innerHTML = '';
    messageReplyToNameElement.innerHTML = '';
    getIdOfReplayingDocument(null);
});

sendButton.addEventListener('click', () => {
    messageReplyCloseButton.click();
});