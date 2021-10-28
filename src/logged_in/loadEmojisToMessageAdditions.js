import emojisCode from '../emojisCode.js';
const SelectedContactComponent = document.querySelector('#SelectedContact');
const messageAdditionsContent = SelectedContactComponent.querySelector('#message-additions-content');
const emojis = messageAdditionsContent.querySelector('#emojis');
const categories = emojis.querySelectorAll('.category');

const loadEmojis = (code) => {
    categories.forEach((category) => {
        if (category.id === 'standard') {
            const emoji = document.createElement("div");
            const tweCode = twemoji.convert.fromCodePoint(code);
            emoji.classList.add('emoji-element');
            emoji.innerHTML = `<p>${tweCode}</p>`;
            category.appendChild(emoji);
        }
    });
}

emojisCode.forEach((emoji) => {
    loadEmojis(emoji.code);
});

twemoji.parse(emojis);