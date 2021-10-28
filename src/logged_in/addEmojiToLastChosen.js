const SelectedContactComponent = document.querySelector('#SelectedContact');
const messageAdditionsContent = SelectedContactComponent.querySelector('#message-additions-content');
const categories = messageAdditionsContent.querySelectorAll('.category');
const standardIcons = messageAdditionsContent.querySelector('#standard');
const emojiElement = standardIcons.querySelectorAll('.emoji-element');

const addEmojiToLastChosen = (emoji) => {
    const lastChosenEmojis = localStorage.getItem('lastChosenEmojis') === null ? '1f601' : localStorage.getItem('lastChosenEmojis');
    const emojiCode = emoji.querySelector('p img').src.split("/").pop().slice(0, -4);
    if (lastChosenEmojis.includes(emojiCode)) {
        const lastChosenEmojisWitchoutRepeated = lastChosenEmojis.replace(`,${emojiCode}`, '');
        localStorage.setItem('lastChosenEmojis', `${lastChosenEmojisWitchoutRepeated},${emojiCode}`);
    } else {
        localStorage.setItem('lastChosenEmojis', `${lastChosenEmojis},${emojiCode}`);
    }
}

emojiElement.forEach((emoji) => {
    emoji.addEventListener('click', () => {
        addEmojiToLastChosen(emoji);
    });
});

export default addEmojiToLastChosen;