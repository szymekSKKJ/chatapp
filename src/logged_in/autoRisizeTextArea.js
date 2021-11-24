const SelectedContactComponent = document.querySelector('#SelectedContact');
const content = SelectedContactComponent.querySelector('#content');
const textarea = document.querySelector('#write-message textarea');
const messagesStatus = SelectedContactComponent.querySelector('#messages-status');
const messageReply = SelectedContactComponent.querySelector('#message-reply');
textarea.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
});

textarea.addEventListener("input", (event) => {
    if (textarea.scrollHeight <= 36) {
        textarea.style.height = "36px";
        content.style.height = `calc(100vh - 120px)`;
        content.scrollTop = content.scrollHeight;
        messagesStatus.style.bottom = `55px`;
        messageReply.style.bottom = `50px`;
    } else if (textarea.scrollHeight > 36) {
        textarea.style.height = (textarea.scrollHeight) + "px";
        content.style.height = `calc(100vh - ${84 + textarea.scrollHeight}px)`;
        content.scrollTop = content.scrollHeight;
        messagesStatus.style.bottom = `${19 + textarea.scrollHeight}px`;
        messageReply.style.bottom = `${textarea.scrollHeight}px`;
    }
}, false);

window.addEventListener('keyup', (event) => {
    if (event.code === 'Backspace' || event.which == '8' || event.code === 'Enter' || event.which == 13) {
        if (textarea.value.length < 1) {
            textarea.style.height = "36px";
            content.scrollTop = content.scrollHeight;
            content.style.height = `calc(100vh - 120px)`;
            messagesStatus.style.bottom = `55px`;
        }
    }
});