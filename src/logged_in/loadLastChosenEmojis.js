import addEmojiToLastChosen from './addEmojiToLastChosen.js';
const SelectedContactComponent = document.querySelector('#SelectedContact');
const messageAdditionsContent = SelectedContactComponent.querySelector('#message-additions-content');
const lastChosenEmojis = SelectedContactComponent.querySelector('#last-chosen');
const writeMessage = SelectedContactComponent.querySelector('#write-message');
const emojisAdditionButton = writeMessage.querySelector('#emojis-addition');
const lastChosenEmojisButton = messageAdditionsContent.querySelectorAll('#categories .category-button')[0];
const emojisElement = messageAdditionsContent.querySelector('#emojis');
const emojis = emojisElement.querySelectorAll('.emoji-element');
const writeWessage = SelectedContactComponent.querySelector('#write-message textarea');

const loadEmojis = () => {
    lastChosenEmojis.innerHTML = '';
    const emojisCodesStorage = localStorage.getItem('lastChosenEmojis');
    const emojisCodes = emojisCodesStorage.split(',');
    emojisCodes.reverse().forEach((emojiCode, index, array) => {
        if (index < 10 && index < array.length - 1) {
            const emojiElement = document.createElement("div");
            const tweCode = twemoji.convert.fromCodePoint(emojiCode);
            emojiElement.classList.add('emoji-element');
            emojiElement.innerHTML = `<p>${tweCode}</p>`;
            lastChosenEmojis.appendChild(emojiElement);
            emojiElement.addEventListener('click', () => {
                const emojiCode = emojiElement.querySelector('p img').src.split("/").pop().slice(0, -4);
                const tweCode = twemoji.convert.fromCodePoint(emojiCode);
                writeWessage.value += `${tweCode}`;
                twemoji.parse(writeWessage.value);
                writeWessage.focus();
                writeWessage.blur();
                addEmojiToLastChosen(emojiElement);
            });

        }
    });
    twemoji.parse(lastChosenEmojis);
}

emojisAdditionButton.addEventListener('click', () => {
    loadEmojis();
});

lastChosenEmojisButton.addEventListener('click', () => {
    loadEmojis();
});