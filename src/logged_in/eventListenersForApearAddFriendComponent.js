import showAndHideComponent from '../showAndHideComponent.js'
const ContactsComponent = document.querySelector('#Contacts');
const addContactButton = Contacts.querySelector('#add-contact-button');
const AddFriendComponent = document.querySelector('#AddFriend');

addContactButton.addEventListener('click', () => {
    showAndHideComponent(AddFriendComponent, ContactsComponent, 'flex');
});