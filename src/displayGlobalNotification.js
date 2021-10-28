const globalNotification = document.querySelector('#global-notification');
const globalNotificationParagraph = globalNotification.querySelector('p');

const displayGlobalNotification = (message, status = 'failure') => {
    globalNotificationParagraph.innerHTML = message;
    globalNotification.style.opacity = '1';
    globalNotification.style.display = 'flex';
    globalNotification.style.animation = '';
    if (status === 'failure') {
        globalNotificationParagraph.style.backgroundColor = '#ac393b';
        setTimeout(() => {
            globalNotification.style.animation = 'failure ease-in-out forwards 4000ms';
        }, 200);
    }
    else if (status === 'success') {
        globalNotificationParagraph.style.backgroundColor = '#1c975b';
        setTimeout(() => {
            globalNotification.style.animation = 'success ease-in-out forwards 4000ms';
        }, 200);
    }
    globalNotification.addEventListener('animationend', () => {
        globalNotification.style.display = 'none';
    });
}
export default displayGlobalNotification;