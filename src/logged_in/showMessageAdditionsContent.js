const SelectedContactComponent = document.querySelector('#SelectedContact');
const messageAdditionsContent = SelectedContactComponent.querySelector('#message-additions-content');
const messageAdditionButtonsElement = SelectedContactComponent.querySelector('#message-addition-buttons');
const messageAdditionButtons = messageAdditionButtonsElement.querySelectorAll('.button');
const writeMessage = SelectedContactComponent.querySelector('#write-message');
const writeMessageInput = writeMessage.querySelector('textarea');
const content = SelectedContactComponent.querySelector('#content');
const backButton = SelectedContactComponent.querySelector('#back-button');
let buttonIndex = 0;
let isOpen = false;

const showAndHideMessageAddition = (element, direction, duration = 500) => {
    element.animate([
        { transform: 'translateY(300px)' },
        { transform: `translateY(0px)` }
    ], {
        duration: duration,
        fill: 'forwards',
        easing: 'ease-in-out',
        direction: direction

    });
}

messageAdditionButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        event.stopPropagation()
        if (button.id === 'emojis-addition') {
            isOpen = true;
            buttonIndex = index;
            content.style.height = 'calc(100vh - 420px)';
            button.style.color = '#ffcc4d';
            writeMessage.style.bottom = '300px';
            messageAdditionsContent.style.display = 'flex';
            showAndHideMessageAddition(messageAdditionsContent, 'normal');
            showAndHideMessageAddition(writeMessage, 'normal');
            setTimeout(() => {
                content.scrollTop = content.scrollHeight - content.clientHeight;
            }, 500);
        }
    });
});

writeMessageInput.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isOpen === true) {
        isOpen = false;
        content.style.height = 'calc(100vh - 120px)';
        messageAdditionButtons[buttonIndex].style.color = 'unset';
        showAndHideMessageAddition(messageAdditionsContent, 'reverse', 50);
        showAndHideMessageAddition(writeMessage, 'reverse', 50);
        setTimeout(() => {
            content.scrollTop = content.scrollHeight - content.clientHeight;
        }, 500);
    }
});

writeMessageInput.addEventListener('input', () => {
    writeMessage.click();
});

content.addEventListener('click', () => {
    writeMessage.click();
});

writeMessage.addEventListener('click', (event) => {
    if (isOpen === true) {
        isOpen = false;
        content.style.height = 'calc(100vh - 120px)';
        messageAdditionButtons[buttonIndex].style.color = 'unset';
        showAndHideMessageAddition(messageAdditionsContent, 'reverse');
        showAndHideMessageAddition(writeMessage, 'reverse');
        setTimeout(() => {
            content.scrollTop = content.scrollHeight - content.clientHeight;
        }, 500);
    }
});

backButton.addEventListener('click', () => {
    writeMessage.click();
});