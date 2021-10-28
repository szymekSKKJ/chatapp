const SelectedContactComponent = document.querySelector('#SelectedContact');
const messageAdditionsContent = SelectedContactComponent.querySelector('#message-additions-content');
const emojisElement = messageAdditionsContent.querySelector('#emojis');
const emojis = emojisElement.querySelectorAll('.emoji-element');
const writeWessage = SelectedContactComponent.querySelector('#write-message textarea');

emojis.forEach((emoji) => {
    emoji.addEventListener('click', () => {
        const emojiCode = emoji.querySelector('p img').src.split("/").pop().slice(0, -4);
        const tweCode = twemoji.convert.fromCodePoint(emojiCode);
        writeWessage.value += `${tweCode}`;
        twemoji.parse(writeWessage.value);
        writeWessage.focus();
        writeWessage.blur();
    });
});