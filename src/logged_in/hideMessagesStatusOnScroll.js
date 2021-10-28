const SelectedContactComponent = document.querySelector('#SelectedContact');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status');
const content = SelectedContactComponent.querySelector('#content');


content.addEventListener('scroll', () => {
    if ((content.scrollHeight - content.clientHeight) - content.scrollTop > 50) {
        messagesStatus.style.opacity = '0';
    } else {
        messagesStatus.style.opacity = '1';
    }
});