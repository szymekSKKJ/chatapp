const globalPopoutMessage = document.querySelector('#global-popout-message');
const message = globalPopoutMessage.querySelector('#message p');
const options = globalPopoutMessage.querySelectorAll('.option');

const displayGlobalPopoutMessage = (messageContent, functionToExecute) => {
    message.innerHTML = messageContent;
    globalPopoutMessage.style.display = 'flex';
    options.forEach((option, index) => {
        option.addEventListener('click', () => {
            if (index === 0) {
                functionToExecute();
            }
            globalPopoutMessage.style.animation = 'none';
            setTimeout(() => {
                globalPopoutMessage.style.animation = 'showUpGlobalPopoutMessage 500ms ease-in-out forwards reverse';
                setTimeout(() => {
                    globalPopoutMessage.style.display = 'none';
                    globalPopoutMessage.style.animation = 'none';
                }, 750);
            }, 25);
        });
    });
}

export default displayGlobalPopoutMessage;