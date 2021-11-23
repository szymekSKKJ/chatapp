const ContactsComponent = document.querySelector('#Contacts');
const friendsListItems = ContactsComponent.querySelectorAll('#content #friends-list .friends-list-item');
const SelectedContactOptionElementsComponent = document.querySelector('#SelectedContactOptionElements');
const changeNicknameInput = SelectedContactOptionElementsComponent.querySelector('#change-nickname #input input');
let id;
let nameElementFromContactsComponent;
const getFriendId = (event, idd) => {
    id = idd;
    nameElementFromContactsComponent = event.target.querySelector('.wrapper .name');
}

const changeNickname = (event, nickname) => {
    localStorage.setItem(id, event.target.value);
    const SelectedContactComponent = document.querySelector('#SelectedContact');
    const contactName = SelectedContactComponent.querySelector('#contact-name');
    contactName.innerHTML = `<p>${localStorage.getItem(id)}</p>`;
    nameElementFromContactsComponent.innerHTML = `<p>${localStorage.getItem(id)}</p>`;
}

changeNicknameInput.addEventListener('input', changeNickname);

const loadNicknames = (id, friendNameElement) => {
    const getNicknameById = localStorage.getItem(id);
    if (getNicknameById) {
        friendNameElement.innerHTML = `
        <p>${getNicknameById}</p>
        `
    }
}

export { loadNicknames, changeNickname, getFriendId };