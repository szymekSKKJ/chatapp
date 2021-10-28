const SelectedContactComponent = document.querySelector('#SelectedContact');
const messageAdditionsContent = SelectedContactComponent.querySelector('#message-additions-content');
const wrapper = messageAdditionsContent.querySelector('#wrapper');
const categoryButtons = messageAdditionsContent.querySelectorAll('#categories .category-button');
const writeMessage = SelectedContactComponent.querySelector('#write-message');
const emojisAddition = writeMessage.querySelector('#emojis-addition');
const categories = messageAdditionsContent.querySelectorAll('.category');
let lastClickButtonIndex = 0;

const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

emojisAddition.addEventListener('click', () => {
    categoryButtons.forEach((button, index) => {
        if (button.className.includes('checked')) {
            categories[index].scrollIntoView({ inline: "start" });

        }
    });
});

categoryButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        categories[index].scrollIntoView({ inline: "start" });
    });
});

wrapper.addEventListener('scroll', () => {
    categories.forEach((category, index) => {
        if (isInViewport(category)) {
            categoryButtons[lastClickButtonIndex].classList.remove('checked');
            categoryButtons[index].classList.add('checked');
            lastClickButtonIndex = index;
        }
    });
});