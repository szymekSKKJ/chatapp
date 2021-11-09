const globalPopoutMessage = document.querySelector('#global-popout-message');
const displayGlobalPopoutMessage = (messageContent, functionToExecute) => {
    const message = globalPopoutMessage.querySelector('#message p');
    const options = globalPopoutMessage.querySelectorAll('.option');
    globalPopoutMessage.style.animation = 'showUpGlobalPopoutMessage 500ms ease-in-out forwards';
    globalPopoutMessage.style.display = 'flex';
    message.innerHTML = `${messageContent}`;
    
    const ifPickedOption = (event) => {
        const index = parseInt(event.target.dataset.index);
        globalPopoutMessage.style.animation = 'none';
        setTimeout(() => {
            globalPopoutMessage.style.animation = 'showUpGlobalPopoutMessage 500ms ease-in-out forwards reverse';
            setTimeout(() => {
                globalPopoutMessage.style.display = 'none';
                globalPopoutMessage.style.animation = 'none';
            }, 500);
        }, 1);

        if (index === 0) {
            functionToExecute();
        }
        
        options.forEach((option) => {
            option.removeEventListener('click', ifPickedOption);
        });
    }

    options.forEach((option, index) => {
        option.dataset.index = index;
        option.addEventListener('click', ifPickedOption);
    });
}

export default displayGlobalPopoutMessage;