import showAndHideComponent from '../showAndHideComponent.js';
import checkIfUserIsLogged from './loadFriendsList.js';
const SelectedContactComponent = document.querySelector('#SelectedContact');
const ContactsComponent = document.querySelector('#Contacts');
const backButton = SelectedContactComponent.querySelector('#upside #back-button');
const AddFriendComponent = document.querySelector('#AddFriend');
const backButton1 = AddFriendComponent.querySelector('#upside #back-button');
const MyProfileOptionsComponent = document.querySelector('#MyProfileOptions');
const backButton2 = MyProfileOptionsComponent.querySelector('#change-profile-image #back-button');
const backButton3 = MyProfileOptionsComponent.querySelector('#change-language #back-button');
const backButton4 = MyProfileOptionsComponent.querySelector('#blocked-users #back-button');

backButton.addEventListener('click', () => {
    showAndHideComponent(ContactsComponent, SelectedContactComponent);
    //checkIfUserIsLogged();
});

backButton1.addEventListener('click', () => {
    showAndHideComponent(ContactsComponent, AddFriendComponent);
    checkIfUserIsLogged();
});

backButton2.addEventListener('click', () => {
    showAndHideComponent(ContactsComponent, MyProfileOptionsComponent);
    checkIfUserIsLogged();
});

backButton3.addEventListener('click', () => {
    showAndHideComponent(ContactsComponent, MyProfileOptionsComponent);
    checkIfUserIsLogged();
});

backButton4.addEventListener('click', () => {
    showAndHideComponent(ContactsComponent, MyProfileOptionsComponent);
    checkIfUserIsLogged();
});